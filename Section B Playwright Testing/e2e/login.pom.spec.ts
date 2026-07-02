import { test } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";

const validUser = {
  email: "deepak@test.com",
  password: "Test@123",
};

test.describe("Login Page - Page Object Model", () => {

    // Test 1 : Page loads correctly
  test("Page loads successfully", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.verifyPageLoaded();
  });

    // Test 2:  Successful Login
  test("User can login successfully", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(validUser.email, validUser.password);

    await loginPage.verifyDashboardRedirect();
  });

    // Test 3 : Invalid Credentials
  test("Should display error for wrong password", async ({page}) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(validUser.email,"WrongPassword123");

    await loginPage.verifyLoginError();
  });

    // Test 4 :  Empty Form
  test("Should not login with empty form", async ({page}) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.clickLogin();
    
    await loginPage.verifyStillOnLoginPage();
  });

    // Test 5 : Loading State
  test("Should show loading state during login", async ({page}) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.enterEmail(validUser.email);
    await loginPage.enterPassword(validUser.password);
    await loginPage.clickLogin();

    await loginPage.verifyLoadingState();
    await loginPage.verifyDashboardRedirect();
  });
});