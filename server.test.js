const request = require('supertest');
const server = require('./server');

// Close the server after tests are done
afterAll((done) => {
  server.close(done);
});

describe('Expense API', () => {
  it('should return a list of expenses at /api/expenses', async () => {
    const res = await request(server).get('/api/expenses');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('description', 'Coffee');
  });
});
