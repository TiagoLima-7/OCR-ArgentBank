import { test, expect } from "@playwright/test";

// ─── Page d'accueil ───────────────────────────────────────────
test("home page has correct title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Argent Bank/);
});

test("home page displays hero content", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("hero-content")).toBeVisible();
});

test("home page displays 3 features", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("feature-item")).toHaveCount(3);
});

// ─── Navigation ───────────────────────────────────────────────
test("sign in link is visible in header", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("text=Sign In")).toBeVisible();
});

test("clicking sign in link navigates to /sign-in", async ({ page }) => {
  await page.goto("/");
  await page.click("text=Sign In");
  await expect(page).toHaveURL("/sign-in");
});

// ─── Page 404 ─────────────────────────────────────────────────
test("unknown route shows 404 page", async ({ page }) => {
  await page.goto("/unknown-page");
  await expect(page.locator("h1")).toContainText("404");
});

test("404 page has back to home button", async ({ page }) => {
  await page.goto("/unknown-page");
  await expect(page.locator("text=Back to Home")).toBeVisible();
});

// ─── Page SignIn ───────────────────────────────────────────────
test("sign in page has email and password fields", async ({ page }) => {
  await page.goto("/sign-in");
  await expect(page.locator("#email")).toBeVisible();
  await expect(page.locator("#password")).toBeVisible();
});

test("sign in with wrong credentials shows error", async ({ page }) => {
  await page.goto("/sign-in");
  // await page.fill("#email", "wrong@email.com");
  // await page.fill("#password", "wrongpassword");
  // await page.click(".sign-in-button");
  await page.getByLabel("Email").fill("wrong@email.com");
  await page.getByLabel("Password").fill("wrongpassword");
  await page.getByTestId("sign-in-button").click();
  await expect(page.getByTestId("error-message")).toBeVisible();
});

test("sign in with correct credentials redirects to profile", async ({
  page,
}) => {
  await page.goto("/sign-in");
  // await page.fill("#email", "tony@stark.com");
  // await page.fill("#password", "password123");
  // await page.click(".sign-in-button");
  await page.getByLabel("email").fill("tony@stark.com");
  await page.getByLabel("password").fill("password123");
  await page.getByTestId("sign-in-button").click();
  await expect(page).toHaveURL("/profile");
});

// ─── Route protégée ───────────────────────────────────────────
test("accessing /profile without login redirects to /sign-in", async ({
  page,
}) => {
  await page.goto("/profile");
  await expect(page).toHaveURL("/sign-in");
});

// ─── Page Profile (après connexion) ───────────────────────────
test("profile page displays user name after login", async ({ page }) => {
  await page.goto("/sign-in");
  // await page.fill("#email", "tony@stark.com");
  // await page.fill("#password", "password123");
  // await page.getByTestId("sign-in-button").click();
  await page.getByLabel("email").fill("tony@stark.com");
  await page.getByLabel("password").fill("password123");
  await page.getByTestId("sign-in-button").click();
  // await expect(page.locator("h1")).toContainText("Tony");
  await expect(page.getByTestId("profile-header")).toContainText("Tony");
});

test("profile page displays 3 account cards", async ({ page }) => {
  await page.goto("/sign-in");
  await page.getByLabel("email").fill("tony@stark.com");
  await page.getByLabel("password").fill("password123");
  await page.getByTestId("sign-in-button").click();
  await expect(page.getByTestId("account-card")).toHaveCount(3);
  // await page.fill("#email", "tony@stark.com");
  // await page.fill("#password", "password123");
  // await page.click(".sign-in-button");
  // await expect(page.locator(".account")).toHaveCount(3);
});

test("header shows user first name after login", async ({ page }) => {
  await page.goto("/sign-in");
  await page.getByLabel("email").fill("tony@stark.com");
  await page.getByLabel("password").fill("password123");
  await page.getByTestId("sign-in-button").click();
  // await page.fill("#email", "tony@stark.com");
  // await page.fill("#password", "password123");
  // await page.click(".sign-in-button");
  // await expect(page.locator(".main-nav")).toContainText("Tony");
  await expect(page.getByRole("link", { name: /Tony/i })).toBeVisible();
});

test("header shows sign out button after login", async ({ page }) => {
  await page.goto("/sign-in");
  await page.getByLabel("email").fill("tony@stark.com");
  await page.getByLabel("password").fill("password123");
  await page.getByTestId("sign-in-button").click();
  // await page.fill("#email", "tony@stark.com");
  // await page.fill("#password", "password123");
  // await page.click(".sign-in-button");
  await expect(page.getByTestId("sign-out-button")).toBeVisible();
});

// ─── Edit Name ────────────────────────────────────────────────
test("edit name form appears when clicking Edit Name", async ({ page }) => {
  await page.goto("/sign-in");
  await page.getByLabel("email").fill("tony@stark.com");
  await page.getByLabel("password").fill("password123");
  await page.getByTestId("sign-in-button").click();
  await page.getByTestId("edit-button").click();
  await expect(page.getByTestId("edit-form")).toBeVisible();
  // await page.fill("#email", "tony@stark.com");
  // await page.fill("#password", "password123");
  // await page.click(".sign-in-button");
  // await page.click(".edit-button");
  // await expect(page.locator(".edit-form")).toBeVisible();
});

test("cancel button closes edit form", async ({ page }) => {
  await page.goto("/sign-in");
  await page.getByLabel("email").fill("tony@stark.com");
  await page.getByLabel("password").fill("password123");
  await page.getByTestId("sign-in-button").click();
  await page.getByTestId("edit-button").click();
  await page.getByTestId("edit-cancel-button").click();
  await expect(page.getByTestId("edit-form")).not.toBeVisible();
  // await page.fill("#email", "tony@stark.com");
  // await page.fill("#password", "password123");
  // await page.click(".sign-in-button");
  // await page.click(".edit-button");
  // await page.click(".edit-cancel-button");
  // await expect(page.locator(".edit-form")).not.toBeVisible();
});

// ─── Logout ───────────────────────────────────────────────────
test("sign out redirects to home page", async ({ page }) => {
  await page.goto("/sign-in");
  await page.getByLabel("email").fill("tony@stark.com");
  await page.getByLabel("password").fill("password123");
  await page.getByTestId("sign-in-button").click();
  await page.getByTestId("sign-out-button").click();
  // await page.fill("#email", "tony@stark.com");
  // await page.fill("#password", "password123");
  // await page.click(".sign-in-button");
  // await page.click("text=Sign Out");
  await expect(page).toHaveURL("/");
});

test("sign in link visible in header after logout", async ({ page }) => {
  await page.goto("/sign-in");
  await page.getByLabel("email").fill("tony@stark.com");
  await page.getByLabel("password").fill("password123");
  await page.getByTestId("sign-in-button").click();
  await page.getByTestId("sign-out-button").click();
  await expect(page.getByRole("link", { name: /Sign in/i })).toBeVisible();
  // await page.fill("#email", "tony@stark.com");
  // await page.fill("#password", "password123");
  // await page.click(".sign-in-button");
  // await page.click("text=Sign Out");
  // await expect(page.locator("text=Sign In")).toBeVisible();
});

// ─── Redirection si déjà connecté ─────────────────────────────
test("accessing /sign-in while logged in redirects to /profile", async ({
  page,
}) => {
  await page.goto("/sign-in");
  // await page.fill("#email", "tony@stark.com");
  // await page.fill("#password", "password123");
  await page.getByLabel("Email").fill("tony@stark.com");
  await page.getByLabel("Password").fill("password123");
  await page.getByTestId("sign-in-button").click();
  // await page.click(".sign-in-button");
  await expect(page).toHaveURL("/profile");
  await page.goto("/sign-in");
  await expect(page).toHaveURL("/profile");
});
