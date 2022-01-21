const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vjkax.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const database = client.db("online_shop");
    const productsCollection = database.collection("products");

    //Get Api
    app.get("/products", async (req, res) => {
      const page = req.query.page;
      const size = parseInt(req.query.size);
      const query = productsCollection.find({});
      const count = await query.count();
      let products;
      if (page) {
        products = await query
          .skip(size * page)
          .limit(size)
          .toArray();
      } else {
        products = await query.toArray();
      }
      res.send({ products, count });
    });
  } finally {
    //await client.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Hello World ema-jhon big online Shop");
});
app.listen(port, () => {
  console.log("Ema-john server-port", port);
});
