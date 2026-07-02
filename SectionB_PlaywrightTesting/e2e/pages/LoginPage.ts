import { Page, Locator, expect } from "@playwright/test";

export class LoginPage {
  readonly page: Page;

  // All locators
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly loadingSpinner: Locator;

  constructor(page: Page) {
    this.page = page;

    // Email input (supports placeholder OR name)
    this.emailInput = page.getByPlaceholder("Email").or(page.locator('input[name="email"]'));

    // Password input (supports placeholder OR name)
    this.passwordInput = page.getByPlaceholder("Password").or(page.locator('input[name="password"]'));

    // Login button (supports Login OR Sign In)
    this.loginButton = page.getByRole("button", { name: /login/i }).or(page.getByRole("button", { name: /sign in/i }));

    // Error message
    this.errorMessage = page.getByText(/invalid credentials|incorrect/i);

    // Generic loading spinner
    this.loadingSpinner = page.locator(
      ".spinner, .loading, [data-testid='loading-spinner']"
    );
  }

    // Navigate to Login Page
  async goto() {
    await this.page.goto("http://localhost:5173/");
  }

    // Fill Email
  async enterEmail(email: string) {
    await this.emailInput.fill(email);
  }

//  Fill Password
  async enterPassword(password: string) {
    await this.passwordInput.fill(password);
  }

    // Click Login Button
  async clickLogin() {
    await this.loginButton.click();
  }


    // Login Helper
  async login(email: string, password: string) {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickLogin();
  }

    //  Verify Login Page Loaded
  async verifyPageLoaded() {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

    //  Verify Redirect
  async verifyDashboardRedirect() {
    await expect(this.page).toHaveURL(/dashboard/);
  }


    // Verify Error Message
  async verifyLoginError() {
    await expect(this.errorMessage).toBeVisible();
  }


    // Verify User Still On Login Page
  async verifyStillOnLoginPage() {
    await expect(this.page).not.toHaveURL(/dashboard/);
  }


    // Verify Loading State
  async verifyLoadingState() {
    const buttonDisabled = await this.loginButton.isDisabled().catch(() => false);

    const spinnerVisible = await this.loadingSpinner.isVisible().catch(() => false);

    expect(buttonDisabled || spinnerVisible).toBeTruthy();
  }
}