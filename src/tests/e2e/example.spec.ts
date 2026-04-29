import { test, expect } from "@playwright/test";

test.describe("Habit Tracker app", () => {
  const testEmail = "e2e@test.com";
  const testPassword = "123456";

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("shows the splash screen and redirects unauthenticated users to /login", async ({
    page,
  }) => {
    await expect(page.getByTestId("splash-screen")).toBeVisible();

    await page.waitForURL("/login");

    await expect(page).toHaveURL("/login");
  });

  test("redirects authenticated users from / to /dashboard", async ({
    page,
  }) => {
    await page.goto("/signup");

    await page.fill('[data-testid="auth-signup-email"]', testEmail);
    await page.fill('[data-testid="auth-signup-password"]', testPassword);
    await page.click('[data-testid="auth-signup-submit"]');

    await page.goto("/");

    await page.waitForURL("/dashboard");

    await expect(page.getByTestId("dashboard-page")).toBeVisible();
  });

  test("prevents unauthenticated access to /dashboard", async ({ page }) => {
    await page.goto("/dashboard");

    await page.waitForURL("/login");

    await expect(page).toHaveURL("/login");
  });

  test("signs up a new user and lands on the dashboard", async ({ page }) => {
    await page.goto("/signup");

    await page.fill('[data-testid="auth-signup-email"]', testEmail);
    await page.fill('[data-testid="auth-signup-password"]', testPassword);
    await page.click('[data-testid="auth-signup-submit"]');

    await page.waitForURL("/dashboard");

    await expect(page.getByTestId("dashboard-page")).toBeVisible();
  });

  test("logs in an existing user and loads only that user's habits", async ({
    page,
  }) => {
    await page.goto("/signup");

    await page.fill('[data-testid="auth-signup-email"]', testEmail);
    await page.fill('[data-testid="auth-signup-password"]', testPassword);
    await page.click('[data-testid="auth-signup-submit"]');

    await page.click('[data-testid="auth-logout-button"]');

    await page.goto("/login");

    await page.fill('[data-testid="auth-login-email"]', testEmail);
    await page.fill('[data-testid="auth-login-password"]', testPassword);
    await page.click('[data-testid="auth-login-submit"]');

    await page.waitForURL("/dashboard");

    await expect(page.getByTestId("dashboard-page")).toBeVisible();
  });

  test("creates a habit from the dashboard", async ({ page }) => {
    await page.goto("/signup");

    await page.fill('[data-testid="auth-signup-email"]', testEmail);
    await page.fill('[data-testid="auth-signup-password"]', testPassword);
    await page.click('[data-testid="auth-signup-submit"]');

    await page.click('[data-testid="create-habit-button"]');

    await page.fill('[data-testid="habit-name-input"]', "Drink Water");
    await page.fill(
      '[data-testid="habit-description-input"]',
      "Stay hydrated"
    );

    await page.click('[data-testid="habit-save-button"]');

    await expect(page.getByText("Drink Water")).toBeVisible();
  });

  test("completes a habit for today and updates the streak", async ({
    page,
  }) => {
    await page.goto("/signup");

    await page.fill('[data-testid="auth-signup-email"]', testEmail);
    await page.fill('[data-testid="auth-signup-password"]', testPassword);
    await page.click('[data-testid="auth-signup-submit"]');

    await page.click('[data-testid="create-habit-button"]');

    await page.fill('[data-testid="habit-name-input"]', "Read Books");
    await page.click('[data-testid="habit-save-button"]');

    const slug = "read-books";

    await page.click(`[data-testid="habit-complete-${slug}"]`);

    await expect(
      page.getByTestId(`habit-streak-${slug}`)
    ).toContainText("1");
  });

  test("persists session and habits after page reload", async ({ page }) => {
    await page.goto("/signup");

    await page.fill('[data-testid="auth-signup-email"]', testEmail);
    await page.fill('[data-testid="auth-signup-password"]', testPassword);
    await page.click('[data-testid="auth-signup-submit"]');

    await page.click('[data-testid="create-habit-button"]');

    await page.fill('[data-testid="habit-name-input"]', "Consistency");
    await page.click('[data-testid="habit-save-button"]');

    await page.reload();

    await expect(page.getByText("Consistency")).toBeVisible();
  });

  test("logs out and redirects to /login", async ({ page }) => {
    await page.goto("/signup");

    await page.fill('[data-testid="auth-signup-email"]', testEmail);
    await page.fill('[data-testid="auth-signup-password"]', testPassword);
    await page.click('[data-testid="auth-signup-submit"]');

    await page.click('[data-testid="auth-logout-button"]');

    await page.waitForURL("/login");

    await expect(page).toHaveURL("/login");
  });

  test("loads the cached app shell when offline after the app has been loaded once", async ({
    page,
  }) => {
    await page.goto("/");

    await page.context().setOffline(true);

    await page.reload();

    await expect(page.getByTestId("splash-screen")).toBeVisible();
  });
});