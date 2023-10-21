const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//MIDDLEWARE
app.use(cors());
app.use(express.json());

// mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ctziwlh.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

const brandsCollection = client.db("brandShopDB").collection("brands");
const productsCollection = client.db("brandShopDB").collection("products");
const cartCollection = client.db("brandShopDB").collection("cartStore");

app.get("/brands", async (req, res) => {
  const cursor = brandsCollection.find();
  const result = await cursor.toArray();
  res.send(result);
});
app.get("/brands/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await brandsCollection.findOne(query);
  res.send(result);
});

app.get("/products", async (req, res) => {
  const cursor = productsCollection.find();
  const result = await cursor.toArray();
  res.send(result);
});

app.get("/products/brand/:brand", async (req, res) => {
  const brand = req.params.brand;
  const query = { brand: brand };
  const cursor = productsCollection.find(query);
  const result = await cursor.toArray();
  res.send(result);
});

app.post("/products", async (req, res) => {
  const product = req.body;
  console.log(product);
  const result = await productsCollection.insertOne(product);
  res.send(result);
});

app.get("/products/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await productsCollection.findOne(query);
  res.send(result);
});

app.put("/products/:id", async (req, res) => {
  const id = req.params.id;
  const updatedProduct = req.body;
  const filter = { _id: new ObjectId(id) };

  const options = { upsert: true };

  const productDoc = {
    $set: {
      name: updatedProduct.name,
      brand: updatedProduct.brand,
      price: updatedProduct.price,
      ratings: updatedProduct.ratings,
      type: updatedProduct.type,
      details: updatedProduct.details,
      photo: updatedProduct.photo,
    },
  };
  const result = await productsCollection.updateOne(
    filter,
    productDoc,
    options
  );
  res.send(result);
});

//-----------------cart ---------------------------

app.get("/cart", async (req, res) => {
  const cursor = cartCollection.find();
  const result = await cursor.toArray();
  res.send(result);
});

app.get("/cart/user/:email", async (req, res) => {
  const email = req.params.email;
  const query = { email: email };
  const cursor = cartCollection.find(query);
  const result = await cursor.toArray();
  res.send(result);
});

app.post("/cart", async (req, res) => {
  const cartProducts = req.body;
  console.log(cartProducts);
  const result = await cartCollection.insertOne(cartProducts);
  res.send(result);
});
app.delete("/cart/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await cartCollection.deleteOne(query);
  res.send(result);
});

app.get("/", (req, res) => {
  res.send("velocity drive is running");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
