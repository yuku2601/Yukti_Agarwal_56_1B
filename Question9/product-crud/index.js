const express = require('express');

const app = express();
const products = [];
let nextId = 1;

app.use(express.json());

app.get('/products', (req, res) => {
  res.json(products);
});

app.get('/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const product = products.find((item) => item.id === id);

  if (!Number.isSafeInteger(id) || !product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json(product);
});

app.post('/products', (req, res) => {
  const { name, price, description } = req.body ?? {};

  if (
    typeof name !== 'string' ||
    !name.trim() ||
    typeof price !== 'number' ||
    !Number.isFinite(price) ||
    price < 0 ||
    typeof description !== 'string'
  ) {
    return res.status(400).json({
      error: 'Provide a non-empty name, a non-negative numeric price, and a description',
    });
  }

  const product = { id: nextId++, name: name.trim(), price, description };
  products.push(product);
  res.status(201).location(`/products/${product.id}`).json(product);
});

app.put('/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const productIndex = products.findIndex((item) => item.id === id);

  if (!Number.isSafeInteger(id) || productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const { name, price, description } = req.body ?? {};

  if (
    typeof name !== 'string' ||
    !name.trim() ||
    typeof price !== 'number' ||
    !Number.isFinite(price) ||
    price < 0 ||
    typeof description !== 'string'
  ) {
    return res.status(400).json({
      error: 'Provide a non-empty name, a non-negative numeric price, and a description',
    });
  }

  products[productIndex] = { id, name: name.trim(), price, description };
  res.json(products[productIndex]);
});

app.delete('/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const productIndex = products.findIndex((item) => item.id === id);

  if (!Number.isSafeInteger(id) || productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  products.splice(productIndex, 1);
  res.status(204).end();
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Product API is running at http://localhost:${port}`);
  });
}

module.exports = app;
