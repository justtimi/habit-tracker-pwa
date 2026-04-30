import { test, expect } from "@playwright/test";

test.describe("Habit Tracker app", () => {
  const testEmail = "e2e@test.com";
  const testPassword = "123456";

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("redirects unauthenticated users to /login", async ({ page }) => {
    await page.goto("/");

    await page.waitForURL("/login");
    await expect(page).toHaveURL("/login");
  });

  test("redirects authenticated users from / to /dashboard", async ({
    page,
  }) => {
    await page.goto("/login");

    await page.fill('[data-testid="auth-login-email"]', "test@example.com");
    await page.fill('[data-testid="auth-login-password"]', "123456");
    await page.click('[data-testid="auth-login-submit"]');

    await expect(page).toHaveURL("/dashboard");

    await page.goto("/");
    await expect(page).toHaveURL("/dashboard");
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

    await expect(page).toHaveURL("/dashboard");
    await expect(page.getByTestId("dashboard-page")).toBeVisible();
  });

  test("logs in an existing user and loads dashboard", async ({ page }) => {
    await page.goto("/signup");

    await page.fill('[data-testid="auth-signup-email"]', testEmail);
    await page.fill('[data-testid="auth-signup-password"]', testPassword);
    await page.click('[data-testid="auth-signup-submit"]');

    await page.click('[data-testid="auth-logout-button"]');

    await page.goto("/login");

    await page.fill('[data-testid="auth-login-email"]', testEmail);
    await page.fill('[data-testid="auth-login-password"]', testPassword);
    await page.click('[data-testid="auth-login-submit"]');

    await expect(page).toHaveURL("/dashboard");
    await expect(page.getByTestId("dashboard-page")).toBeVisible();
  });

  test("creates a habit from dashboard", async ({ page }) => {
    await page.goto("/signup");

    await page.fill('[data-testid="auth-signup-email"]', testEmail);
    await page.fill('[data-testid="auth-signup-password"]', testPassword);
    await page.click('[data-testid="auth-signup-submit"]');

    await page.click('[data-testid="create-habit-button"]');

    await page.fill('[data-testid="habit-name-input"]', "Drink Water");
    await page.fill('[data-testid="habit-description-input"]', "Stay hydrated");

    await page.selectOption('[data-testid="habit-frequency-select"]', "daily");

    await page.click('[data-testid="habit-save-button"]');

    const slug = "drink-water";

    await expect(page.getByTestId(`habit-card-${slug}`)).toBeVisible();
    await expect(page.getByText("Drink Water")).toBeVisible();
  });

  test("completes a habit and updates streak", async ({ page }) => {
    await page.goto("/signup");

    await page.fill('[data-testid="auth-signup-email"]', testEmail);
    await page.fill('[data-testid="auth-signup-password"]', testPassword);
    await page.click('[data-testid="auth-signup-submit"]');

    await page.click('[data-testid="create-habit-button"]');

    await page.fill('[data-testid="habit-name-input"]', "Read Books");
    await page.fill('[data-testid="habit-description-input"]', "Read daily");

    await page.selectOption('[data-testid="habit-frequency-select"]', "daily");

    await page.click('[data-testid="habit-save-button"]');

    const slug = "read-books";

    await page.click(`[data-testid="habit-complete-${slug}"]`);

    await expect(page.getByTestId(`habit-streak-${slug}`)).toContainText("1");
  });

  test("persists habits after page reload", async ({ page }) => {
    await page.goto("/signup");

    await page.fill('[data-testid="auth-signup-email"]', testEmail);
    await page.fill('[data-testid="auth-signup-password"]', testPassword);
    await page.click('[data-testid="auth-signup-submit"]');

    await page.click('[data-testid="create-habit-button"]');

    await page.fill('[data-testid="habit-name-input"]', "Consistency");
    await page.fill('[data-testid="habit-description-input"]', "Be consistent");

    await page.selectOption('[data-testid="habit-frequency-select"]', "daily");

    await page.click('[data-testid="habit-save-button"]');

    await page.reload();

    await expect(page.getByText("Consistency")).toBeVisible();
  });

  test("logs out and redirects to login", async ({ page }) => {
    await page.goto("/signup");

    await page.fill('[data-testid="auth-signup-email"]', testEmail);
    await page.fill('[data-testid="auth-signup-password"]', testPassword);
    await page.click('[data-testid="auth-signup-submit"]');

    await page.click('[data-testid="auth-logout-button"]');

    await page.waitForURL("/login");
    await expect(page).toHaveURL("/login");
  });

  test("offline mode still shows app shell", async ({ page }) => {
    await page.goto("/");

    await page.context().setOffline(true);

    await page.reload();

    await expect(page.locator("body")).toBeVisible();
  });
});
