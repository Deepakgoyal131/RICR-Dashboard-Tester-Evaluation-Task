import { test, expect } from '@playwright/test';

const validUser = {
    email: "deepak@test.com",
    password: "Test@123",
};

test.describe("Login Page UI Tests", () => {

    //  Define Locaters 
    const getEmailInput = (page: any) =>
        page.getByPlaceholder("Email").or(page.locator('input[name="email"]'));

    const getPasswordInput = (page: any) =>
        page.getByPlaceholder("Password").or(page.locator('input[name="password"]'));

    const getLoginButton = (page: any) =>
        page.getByRole("button", { name: /login/i }).or(page.getByRole("button", { name: /sign in/i }));

    // Test 9 : Page loads correctly
    test("Page loads with email, password and login button", async ({page}) => {
        await page.goto("http://localhost:5173/");

        await expect(getEmailInput(page)).toBeVisible();
        await expect(getPasswordInput(page)).toBeVisible();
        await expect(getLoginButton(page)).toBeVisible();
    });

    // Test 10 : Successful Login
    test("User can login successfully", async ({ page }) => {
        await page.goto("http://localhost:5173/");

        await getEmailInput(page).fill(validUser.email);
        await getPasswordInput(page).fill(validUser.password);
        await getLoginButton(page).click();

        await expect(page).toHaveURL(/dashboard/);
    });

    // Test 11 : Invalid Login
    test("Display error message for invalid credentials", async ({page}) => {
        await page.goto("http://localhost:5173/");

        await getEmailInput(page).fill(validUser.email);
        await getPasswordInput(page).fill("WrongPassword");
        await getLoginButton(page).click();

        await expect(
            page.getByText(/invalid credentials|incorrect/i)
        ).toBeVisible();
    });


    // Test 12 : Empty Form Validation
    test("Should not login with empty form", async ({ page }) => {
        await page.goto("http://localhost:5173/");

        await getLoginButton(page).click();

        // Either validation message appears
        const validationMessage = page.getByText(
            /required|email is required|password is required/i
        );

        if (await validationMessage.isVisible().catch(() => false)) {
            await expect(validationMessage).toBeVisible();
        }

        // OR Check user remains on Login page
        await expect(page).not.toHaveURL(/dashboard/);
    });

    // Test 13 : Loading State
    test("Login button shows loading state while request is in progress", async ({page}) => {
        await page.goto("http://localhost:5173/");

        await getEmailInput(page).fill(validUser.email);
        await getPasswordInput(page).fill(validUser.password);

        const loginButton = getLoginButton(page);
        await loginButton.click();

        // Assignment allows either disabled button OR spinner
        const spinner = page.locator(
            ".spinner, .loading, [data-testid='loading-spinner']"
        );

        const isButtonDisabled = await loginButton
            .isDisabled()
            .catch(() => false);

        const isSpinnerVisible = await spinner
            .isVisible()
            .catch(() => false);

        expect(isButtonDisabled || isSpinnerVisible).toBeTruthy();

        // Final redirect
        await expect(page).toHaveURL(/dashboard/);
    });
});