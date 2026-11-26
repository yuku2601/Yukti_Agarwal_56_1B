const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Products
let products = [
  { id: 1, name: "Laptop", price: 50000 },
  { id: 2, name: "Mobile", price: 20000 }
];

// Cart
let cart = [];

// Orders
let orders = [];

// Display All Products
app.get("/products", (req, res) => {
  res.json(products);
});

// Add Product To Cart
app.post("/cart/:id", (req, res) => {

  const product = products.find(
    p => p.id == req.params.id
  );

  if (!product) {
    return res.send("Product Not Found");
  }

  cart.push(product);

  res.send("Added To Cart");
});

// View Cart
app.get("/cart", (req, res) => {
  res.json(cart);
});

// Payment
app.post("/payment", (req, res) => {

  orders = [...orders, ...cart];

  cart = [];

  res.send("Payment Successful");
});

// View Orders
app.get("/orders", (req, res) => {
  res.json(orders);
});

// Seller Panel - Add Product
app.post("/admin/add", (req, res) => {

  const product = {
    id: products.length + 1,
    name: req.body.name,
    price: req.body.price
  };

  products.push(product);

  res.send("Product Added Successfully");
});

// Seller Panel - Edit Product
app.put("/admin/edit/:id", (req, res) => {

  const product = products.find(
    p => p.id == req.params.id
  );

  if (!product) {
    return res.send("Product Not Found");
  }

  product.name = req.body.name;
  product.price = req.body.price;

  res.send("Product Updated Successfully");
});

// Server
app.listen(3000, () => {
  console.log("Server Running On Port 3000");
});
