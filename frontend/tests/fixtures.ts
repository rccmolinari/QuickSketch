import { test as base, expect } from '@playwright/test';

const API_URL = 'http://localhost:3000';

export type TestUser = {
  username: string;
  email: string;
  password: string;
};

export const test = base.extend<{ testUser: TestUser }>({
  testUser: async ({ request }, use) => {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const user: TestUser = {
      username: `e2e_${id}@test.local`,
      email: `e2e_${id}@test.local`,
      password: 'Password123!',
    };

    const res = await request.post(`${API_URL}/api/auth/register`, { data: user });
    expect(res.status(), 'seeding: la register deve riuscire').toBe(201);

    await use(user);

    const del = await request.delete(`${API_URL}/api/test/users/${user.username}`);
    expect(del.ok(), 'cleanup: la delete deve riuscire').toBeTruthy();
  },
});

export { expect };
