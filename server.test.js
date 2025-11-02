const request = require('supertest');
const server = require('./server'); // Import our server

// Close the server after tests are done
afterAll((done) => {
  server.close(done);
});

describe('Expense API', () => {

  // Test the READ endpoint
  it('GET /api/expenses - should return a list of expenses', async () => {
    const res = await request(server).get('/api/expenses');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true); // Should be an array
  });

  // Test the CREATE endpoint
  it('POST /api/expenses - should create a new expense', async () => {
    const res = await request(server)
      .post('/api/expenses')
      .send({
        description: 'Test Item',
        amount: 123.45
      });
      
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.description).toBe('Test Item');
  });
  
  // Test for bad input
  it('POST /api/expenses - should fail with bad data', async () => {
    const res = await request(server)
      .post('/api/expenses')
      .send({
        description: 'Bad Test'
        // Missing amount
      });
      
    expect(res.statusCode).toEqual(400);
  });

  // (We would also add tests for DELETE and PUT)
});
