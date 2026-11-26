const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

let products = [
  { id: 1, name: "Laptop", price: 50000, rating: 4.5 },
  { id: 2, name: "Mobile", price: 20000, rating: 4.2 }
];

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.post("/api/products", (req, res) => {

  const product = {
    id: products.length + 1,
    name: req.body.name,
    price: req.body.price,
    rating: req.body.rating
  };

  products.push(product);
  res.json(product);
});

app.listen(3000, () => {
  console.log("Server Running on Port 3000");
});