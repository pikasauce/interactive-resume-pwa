const { test, expect } = require('@playwright/test');

// These hit resume-api directly via Playwright's `request` fixture, rather
// than through a browser page — useful for asserting a service's contract
// (status codes, JSON shape) independently of anything that renders it.
const API_BASE_URL = 'http://localhost:3001';

test.describe('resume-api contract', () => {
  test('GET / describes the service and its endpoints', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.service).toBe('resume-release-api');
    expect(body.status).toBe('ok');
    expect(body.endpoints).toMatchObject({
      health: '/health',
      releaseSignal: '/release-signal',
      profile: '/profile',
    });
  });

  test('GET /health reports ok', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/health`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.status).toBe('ok');
  });

  test('GET /release-signal returns a ready status with checks', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/release-signal`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.status).toBe('ready');
    expect(typeof body.message).toBe('string');
    expect(body.message.length).toBeGreaterThan(0);
    expect(Array.isArray(body.checks)).toBe(true);
    expect(body.checks.length).toBeGreaterThan(0);
  });

  test('GET /profile describes the candidate', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/profile`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.name).toBe('Enrique Pujol');
    expect(typeof body.title).toBe('string');
    expect(Array.isArray(body.strengths)).toBe(true);
    expect(body.strengths.length).toBeGreaterThan(0);
  });

  test('unknown routes return 404', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/does-not-exist`);
    expect(response.status()).toBe(404);
  });
});
