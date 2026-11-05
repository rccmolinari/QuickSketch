import { test, expect } from './fixtures';

test('login e logout con utente seedato', async ({ page, testUser }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Log in' }).click();
  await expect(page).toHaveURL(/\/login$/);

  await page.getByPlaceholder('name@example.com').fill(testUser.email);
  await page.getByPlaceholder('••••••••').fill(testUser.password);
  await page.getByRole('button', { name: 'Log in' }).click();

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('link', { name: 'Log in' })).not.toBeVisible();

  await page.getByText('Logout').click();
  await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible();
});


test('Login e crea sketch con utente seedato', async ({ page, testUser }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Log in' }).click();
  await expect(page).toHaveURL(/\/login$/);

  await page.getByPlaceholder('name@example.com').fill(testUser.email);
  await page.getByPlaceholder('••••••••').fill(testUser.password);
  await page.getByRole('button', { name: 'Log in' }).click();

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('link', { name: 'Log in' })).not.toBeVisible();
  await page.getByRole('link', { name: 'Draw' }).click();
  await page.locator('.grid button').first().click();
  await page.getByRole('button', { name: 'Start drawing' }).click();
  await page.getByRole('button', { name: 'Publish sketch' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('main').getByText(testUser.username)).toBeVisible();
});


test('Login, indovina e scrivi con utente seedato', async ({ page, testUser }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Log in' }).click();
  await expect(page).toHaveURL(/\/login$/);

  await page.getByPlaceholder('name@example.com').fill(testUser.email);
  await page.getByPlaceholder('••••••••').fill(testUser.password);
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('link', { name: 'Log in' })).not.toBeVisible();
  const cardStabile = page.locator('.grid > div').filter({ hasNotText: 'e2e_' }).first();
  await cardStabile.getByRole('link', { name: 'Guess' }).click();
  await page.getByPlaceholder('Your guess...').fill('boh');
  await page.getByRole('button', { name: 'Send' }).click();
  await expect(page.getByText('boh')).toBeVisible();

});


test('login, crea sketch e lo ritrova nella sua area personale', async ({ page, testUser }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Log in' }).click();
  await expect(page).toHaveURL(/\/login$/);

  await page.getByPlaceholder('name@example.com').fill(testUser.email);
  await page.getByPlaceholder('••••••••').fill(testUser.password);
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page).toHaveURL(/\/$/);

  await page.getByRole('link', { name: 'Draw' }).click();
  await page.locator('.grid button').first().click();
  await page.getByRole('button', { name: 'Start drawing' }).click();
  await page.getByRole('button', { name: 'Publish sketch' }).click();
  await expect(page).toHaveURL(/\/$/);

  await page.getByRole('link', { name: testUser.username }).click();
  await expect(page).toHaveURL(/\/profile$/);

  await expect(page.getByRole('heading', { name: testUser.username })).toBeVisible();

  const boxDisegni = page.locator('.grid > div').filter({ hasText: 'Sketches created' });
  await expect(boxDisegni).toContainText('1');

  await expect(page.getByRole('link', { name: 'View' })).toBeVisible();
});


test('dopo 10 tentativi sbagliati il gioco si chiude, anche dopo re-login', async ({ page, testUser }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Log in' }).click();
  await page.getByPlaceholder('name@example.com').fill(testUser.email);
  await page.getByPlaceholder('••••••••').fill(testUser.password);
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page).toHaveURL(/\/$/);

  const cardStabile = page.locator('.grid > div').filter({ hasNotText: 'e2e_' }).first();
  await cardStabile.getByRole('link', { name: 'Guess' }).click();
  await expect(page).toHaveURL(/\/sketch\/\d+$/);
  const sketchUrl = page.url();

  for (let i = 1; i <= 10; i++) {
    await page.getByPlaceholder('Your guess...').fill('superduperduskithecat');
    await page.getByRole('button', { name: 'Send' }).click();
    await expect(page.getByText('superduperduskithecat')).toHaveCount(i);
  }

  await expect(page.getByText('Out of attempts')).toBeVisible();
  await expect(page.getByText('The word was:')).toBeVisible();
  await expect(page.getByPlaceholder('Your guess...')).not.toBeVisible();

  await page.getByText('Logout').click();
  await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible();
  await page.getByRole('link', { name: 'Log in' }).click();
  await page.getByPlaceholder('name@example.com').fill(testUser.email);
  await page.getByPlaceholder('••••••••').fill(testUser.password);
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page).toHaveURL(/\/$/);

  await page.goto(sketchUrl);
  await expect(page.getByText('Out of attempts')).toBeVisible();
  await expect(page.getByText('The word was:')).toBeVisible();
  await expect(page.getByPlaceholder('Your guess...')).not.toBeVisible();
});


test('due tentativi su uno sketch e il profilo segna Tentativi totali = 2', async ({ page, testUser }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Log in' }).click();
  await page.getByPlaceholder('name@example.com').fill(testUser.email);
  await page.getByPlaceholder('••••••••').fill(testUser.password);
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page).toHaveURL(/\/$/);

  const cardStabile = page.locator('.grid > div').filter({ hasNotText: 'e2e_' }).first();
  await cardStabile.getByRole('link', { name: 'Guess' }).click();
  await expect(page).toHaveURL(/\/sketch\/\d+$/);

  for (let i = 1; i <= 2; i++) {
    await page.getByPlaceholder('Your guess...').fill('superduperduskithecat');
    await page.getByRole('button', { name: 'Send' }).click();
    await expect(page.getByText('superduperduskithecat')).toHaveCount(i);
  }

  await page.getByRole('link', { name: testUser.username }).click();
  await expect(page).toHaveURL(/\/profile$/);

  const boxTentativi = page.locator('.grid > div').filter({ hasText: 'Total attempts' });
  await expect(boxTentativi.locator('div').first()).toHaveText('2');
});
