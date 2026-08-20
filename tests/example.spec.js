import { test, expect } from "@playwright/test";

// --- Page d'accueil -----------------------------------------
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

// --- Navigation -----------------------------------------
test("sign in link is visible in header", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("text=Sign In")).toBeVisible();
});

test("clicking sign in link navigates to /sign-in", async ({ page }) => {
  await page.goto("/");
  await page.click("text=Sign In");
  await expect(page).toHaveURL("/sign-in");
});

// --- Page 404 -----------------------------------------
test("unknown route shows 404 page", async ({ page }) => {
  await page.goto("/unknown-page");
  await expect(page.getByTestId("404-title")).toContainText("404");
});

test("404 page has back to home button", async ({ page }) => {
  await page.goto("/unknown-page");
  await expect(page.locator("text=Back to Home")).toBeVisible();
});

// --- Page SignIn -----------------------------------------
test("sign in page has email and password fields", async ({ page }) => {
  await page.goto("/sign-in");
  await expect(page.locator("#email")).toBeVisible();
  await expect(page.locator("#password")).toBeVisible();
});

test("sign in with wrong credentials shows error", async ({ page }) => {
  await page.goto("/sign-in");
  await page.getByLabel("Email").fill("wrong@email.com");
  await page.getByLabel("Password").fill("wrongpassword");
  await page.getByTestId("sign-in-button").click();
  await expect(page.getByTestId("error-message")).toBeVisible();
});

test("sign in with correct credentials redirects to profile", async ({
  page,
}) => {
  await page.goto("/sign-in");
  await page.getByLabel("email").fill("tony@stark.com");
  await page.getByLabel("password").fill("password123");
  await page.getByTestId("sign-in-button").click();
  await expect(page).toHaveURL("/profile");
});

// --- Route protégée -----------------------------------------
test("accessing /profile without login redirects to /sign-in", async ({
  page,
}) => {
  await page.goto("/profile");
  await expect(page).toHaveURL("/sign-in");
});

// --- Page Profile (après connexion) -----------------------------------------
test("profile page displays user name after login", async ({ page }) => {
  await page.goto("/sign-in");
  await page.getByLabel("email").fill("tony@stark.com");
  await page.getByLabel("password").fill("password123");
  await page.getByTestId("sign-in-button").click();
  await expect(page.getByTestId("profile-header")).toContainText("Tony");
});

test("profile page displays 3 account cards", async ({ page }) => {
  await page.goto("/sign-in");
  await page.getByLabel("email").fill("tony@stark.com");
  await page.getByLabel("password").fill("password123");
  await page.getByTestId("sign-in-button").click();
  await expect(page.getByTestId("account-card")).toHaveCount(3);
  await expect(
    page.getByTestId("account-card").nth(0).locator("h3"),
  ).toContainText("Argent Bank Checkings");
});

test("header shows user first name after login", async ({ page }) => {
  await page.goto("/sign-in");
  await page.getByLabel("email").fill("tony@stark.com");
  await page.getByLabel("password").fill("password123");
  await page.getByTestId("sign-in-button").click();
  await expect(page.getByRole("link", { name: /Tony/i })).toBeVisible();
});

test("header shows sign out button after login", async ({ page }) => {
  await page.goto("/sign-in");
  await page.getByLabel("email").fill("tony@stark.com");
  await page.getByLabel("password").fill("password123");
  await page.getByTestId("sign-in-button").click();
  await expect(page.getByTestId("sign-out-button")).toBeVisible();
});

// --- Edit Name -----------------------------------------
test("edit name form appears when clicking Edit Name", async ({ page }) => {
  await page.goto("/sign-in");
  await page.getByLabel("email").fill("tony@stark.com");
  await page.getByLabel("password").fill("password123");
  await page.getByTestId("sign-in-button").click();
  await page.getByTestId("edit-button").click();
  await expect(page.getByTestId("edit-form")).toBeVisible();
});

test("cancel button closes edit form", async ({ page }) => {
  await page.goto("/sign-in");
  await page.getByLabel("email").fill("tony@stark.com");
  await page.getByLabel("password").fill("password123");
  await page.getByTestId("sign-in-button").click();
  await page.getByTestId("edit-button").click();
  await page.getByTestId("edit-cancel-button").click();
  await expect(page.getByTestId("edit-form")).not.toBeVisible();
});

// --- Logout -----------------------------------------
test("sign out redirects to home page", async ({ page }) => {
  await page.goto("/sign-in");
  await page.getByLabel("email").fill("tony@stark.com");
  await page.getByLabel("password").fill("password123");
  await page.getByTestId("sign-in-button").click();
  await page.getByTestId("sign-out-button").click();
  await expect(page).toHaveURL("/");
});

test("sign in link visible in header after logout", async ({ page }) => {
  await page.goto("/sign-in");
  await page.getByLabel("email").fill("tony@stark.com");
  await page.getByLabel("password").fill("password123");
  await page.getByTestId("sign-in-button").click();
  await page.getByTestId("sign-out-button").click();
  await expect(page.getByRole("link", { name: /Sign in/i })).toBeVisible();
});

// --- Remember Me -----------------------------------------
test("failed login does not save email in localStorage", async ({ page }) => {
  await page.goto("/sign-in");
  // Coche la case Remember Me
  await page.getByTestId("remember-me").check();
  // Tente une connexion avec de mauvais identifiants
  await page.getByLabel("Email").fill("wrong@email.com");
  await page.getByLabel("Password").fill("wrongpassword");
  await page.getByTestId("sign-in-button").click();
  // Vérifie que l'email n'est PAS dans localStorage
  const savedEmail = await page.evaluate(() =>
    localStorage.getItem("rememberedEmail"),
  );
  expect(savedEmail).toBeNull();
});

test("successful login with remember me saves email in localStorage", async ({
  page,
}) => {
  await page.goto("/sign-in");
  // Coche la case Remember Me
  await page.getByTestId("remember-me").check();
  // Connexion réussie
  await page.getByLabel("Email").fill("tony@stark.com");
  await page.getByLabel("Password").fill("password123");
  await page.getByTestId("sign-in-button").click();
  await expect(page).toHaveURL("/profile");
  // Vérifie que l'email EST dans localStorage
  const savedEmail = await page.evaluate(() =>
    localStorage.getItem("rememberedEmail"),
  );
  expect(savedEmail).toBe("tony@stark.com");
});

test("successful login without remember me removes email from localStorage", async ({
  page,
}) => {
  // Simule un email déjà sauvegardé
  await page.goto("/sign-in");
  await page.evaluate(() =>
    localStorage.setItem("rememberedEmail", "tony@stark.com"),
  );
  await page.reload();
  // Décoche la case Remember Me
  await page.getByTestId("remember-me").uncheck();
  // Connexion réussie
  await page.getByLabel("Email").fill("tony@stark.com");
  await page.getByLabel("Password").fill("password123");
  await page.getByTestId("sign-in-button").click();
  await expect(page).toHaveURL("/profile");
  // Vérifie que l'email EST supprimé du localStorage
  const savedEmail = await page.evaluate(() =>
    localStorage.getItem("rememberedEmail"),
  );
  expect(savedEmail).toBeNull();
});
