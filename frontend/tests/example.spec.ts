import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  await page.getByRole('link', { name: 'Get started' }).click();

  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

test('login link', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Log in' }).click();
  await expect(page).toHaveURL(/\/login$/);

  await page.getByPlaceholder('name@example.com').fill('utente-che-non-esiste@example.com');
  await page.getByPlaceholder('••••••••').fill('password-sbagliata');
  await page.getByRole('button', { name: 'Log in' }).click();
  const errorMessage = page.locator('#errorMessage');
  await expect(errorMessage).toBeVisible();
});

test('login and logout', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Log in' }).click();
  await expect(page).toHaveURL(/\/login$/);

  await page.getByPlaceholder('name@example.com').fill('test@gmail.com');
  await page.getByPlaceholder('••••••••').fill('test33');
  await page.getByRole('button', { name: 'Log in' }).click();

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('link', { name: 'Log in' })).not.toBeVisible();
  await page.getByText('Logout').click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible();
});

test('indovina da non loggato porta alla pagina di login', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: 'Guess' }).first().click();

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByPlaceholder('name@example.com')).toBeVisible();
});

test('disegna da non loggato porta alla pagina di login', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: 'Draw' }).click();

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByPlaceholder('name@example.com')).toBeVisible();
});
