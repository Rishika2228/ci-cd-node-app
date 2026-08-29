const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const app = require('../app');

test('GET / returns the application status message', async () => {
  const server = app.listen(0);

  try {
    const { port } = server.address();
    const response = await new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${port}/`, resolve).on('error', reject);
    });
    let body = '';

    for await (const chunk of response) {
      body += chunk;
    }

    assert.equal(response.statusCode, 200);
    assert.equal(body, 'Hello! CI/CD Node.js Application is Working!');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
