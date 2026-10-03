/**
 * Automated Tests for the Running Average Calculator API.
 *
 * Uses Jest as the test runner and Supertest to send HTTP requests
 * to the Express app without starting a real server.
 *
 * Each test uses a fresh app and service instance to ensure
 * tests do not share state.
 */
const request = require('supertest');
const createApp = require('../src/app');
const AverageService = require('../src/services/average.service');

/**
 * Helper: Create a fresh app instance for isolated testing.
 * Each test gets its own service so state is never shared.
 *
 * @returns {import('express').Application} Fresh Express app.
 */
function freshApp() {
  const service = new AverageService();
  const { app } = createApp(service);
  return app;
}

describe('POST /average', () => {
  // --- 1. First number returns itself as the average ---
  test('first number returns itself as the average', async () => {
    const app = freshApp();

    const res = await request(app)
      .post('/average')
      .send({ number: 10 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ average: 10, count: 1, sum: 10 });
  });

  // --- 2. Running average is calculated correctly for multiple requests ---
  test('running average is calculated correctly for multiple requests', async () => {
    const app = freshApp();

    await request(app).post('/average').send({ number: 10 });
    await request(app).post('/average').send({ number: 20 });
    const res = await request(app).post('/average').send({ number: 30 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ average: 20, count: 3, sum: 60 });
  });

  // --- 3. Decimal numbers are supported ---
  test('decimal numbers are supported', async () => {
    const app = freshApp();

    await request(app).post('/average').send({ number: 1.5 });
    const res = await request(app).post('/average').send({ number: 2.5 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ average: 2, count: 2, sum: 4 });
  });

  // --- 4. Negative numbers are supported ---
  test('negative numbers are supported', async () => {
    const app = freshApp();

    await request(app).post('/average').send({ number: -10 });
    const res = await request(app).post('/average').send({ number: 10 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ average: 0, count: 2, sum: 0 });
  });

  // --- 5. Zero is accepted ---
  test('zero is accepted', async () => {
    const app = freshApp();

    const res = await request(app)
      .post('/average')
      .send({ number: 0 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ average: 0, count: 1, sum: 0 });
  });

  // --- 6. Missing number is rejected ---
  test('missing number is rejected with 400', async () => {
    const app = freshApp();

    const res = await request(app)
      .post('/average')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  // --- 7. String input is rejected ---
  test('string input is rejected with 400', async () => {
    const app = freshApp();

    const res = await request(app)
      .post('/average')
      .send({ number: 'hello' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  // --- 8. Null input is rejected ---
  test('null input is rejected with 400', async () => {
    const app = freshApp();

    const res = await request(app)
      .post('/average')
      .send({ number: null });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  // --- 9. Invalid numeric values (Infinity, NaN) are rejected ---
  test('Infinity is rejected with 400', async () => {
    const app = freshApp();

    const res = await request(app)
      .post('/average')
      .send({ number: Infinity })
      .set('Content-Type', 'application/json');

    // JSON.stringify converts Infinity to null, which will be rejected
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('invalid JSON is rejected with 400', async () => {
    const app = freshApp();

    const res = await request(app)
      .post('/average')
      .set('Content-Type', 'application/json')
      .send('{ invalid json }');

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  // --- 10. Independent test instances do not share state ---
  test('independent test instances do not share state', async () => {
    // First isolated instance
    const app1 = freshApp();
    await request(app1).post('/average').send({ number: 100 });

    // Second isolated instance — should NOT see the 100 from app1
    const app2 = freshApp();
    const res = await request(app2)
      .post('/average')
      .send({ number: 5 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ average: 5, count: 1, sum: 5 });
  });
});
