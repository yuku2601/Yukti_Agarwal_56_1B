const assert = require('node:assert/strict');
const { after, before, test } = require('node:test');
const app = require('./index');

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test('creates, reads, updates, and deletes a product', async () => {
  const createdResponse = await fetch(`${baseUrl}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Notebook',
      price: 4.5,
      description: 'A lined notebook',
    }),
  });

  assert.equal(createdResponse.status, 201);
  assert.equal(createdResponse.headers.get('location'), '/products/1');
  const created = await createdResponse.json();
  assert.deepEqual(created, {
    id: 1,
    name: 'Notebook',
    price: 4.5,
    description: 'A lined notebook',
  });

  const listResponse = await fetch(`${baseUrl}/products`);
  assert.deepEqual(await listResponse.json(), [created]);

  const readResponse = await fetch(`${baseUrl}/products/${created.id}`);
  assert.deepEqual(await readResponse.json(), created);

  const updateResponse = await fetch(`${baseUrl}/products/${created.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Updated notebook',
      price: 5,
      description: 'A hardcover notebook',
    }),
  });
  assert.equal(updateResponse.status, 200);
  assert.deepEqual(await updateResponse.json(), {
    id: 1,
    name: 'Updated notebook',
    price: 5,
    description: 'A hardcover notebook',
  });

  const deleteResponse = await fetch(`${baseUrl}/products/${created.id}`, {
    method: 'DELETE',
  });
  assert.equal(deleteResponse.status, 204);

  const missingResponse = await fetch(`${baseUrl}/products/${created.id}`);
  assert.equal(missingResponse.status, 404);
});

test('rejects invalid products and reports missing products', async () => {
  const invalidResponse = await fetch(`${baseUrl}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: '', price: -1, description: 12 }),
  });
  assert.equal(invalidResponse.status, 400);

  const missingResponse = await fetch(`${baseUrl}/products/999`);
  assert.equal(missingResponse.status, 404);
});
