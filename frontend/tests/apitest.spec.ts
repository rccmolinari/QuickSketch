import { test, expect } from './fixtures';

const API_URL = 'http://localhost:3000';

test('endpoint protetto senza login risponde 401', async ({ request }) => {
  const res = await request.get(`${API_URL}/api/users/me/stats`);

  expect(res.status()).toBe(401);
  expect((await res.json()).message).toBe('Not authenticated');
});

test('login con credenziali giuste risponde 200', async ({ request, testUser }) => {
  const res = await request.post(`${API_URL}/api/auth/login`, {
    data: { email: testUser.email, password: testUser.password },
  });

  expect(res.status()).toBe(200);
});

test('login con password sbagliata risponde 401', async ({ request, testUser }) => {
  const res = await request.post(`${API_URL}/api/auth/login`, {
    data: { email: testUser.email, password: 'password-sbagliata' },
  });

  expect(res.status()).toBe(401);
});
