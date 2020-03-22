const fs = require('fs');
require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { MongoClient } = require('mongodb');

const url = process.env.DB_URL || 'mongodb+srv://ritu:Ghanshi%401986@cluster1-0stib.mongodb.net/productinventory?retryWrites=true&w=majority';
let db;
// const port = process.env.API_SERVER_PORT || 3000;

let aboutMessage = 'Product Inventory API v2.0';

const resolvers = {
  Query: {
    about: () => aboutMessage,
    // eslint-disable-next-line no-use-before-define
    productList,
  },
  Mutation: {
    // eslint-disable-next-line no-use-before-define
    setAboutMessage,
    // eslint-disable-next-line no-use-before-define
    addProduct,
  },
};

const enableCors = (process.env.ENABLE_CORS || 'true') === 'true';
console.log('CORS setting:', enableCors);


async function setAboutMessage(_, { message }) {
  // eslint-disable-next-line no-return-assign
  return aboutMessage = message;
}

async function productList() {
  const products = await db
    .collection('products')
    .find()
    .toArray();
  return products;
}

async function getProductsSequence(name) {
  const result = await db
    .collection('counters')
    .findOneAndUpdate(
      { _id: name },
      { $inc: { current: 1 } },
      { returnOriginal: false },
    );
  return result.value.current;
}
async function addProduct(_, { product }) {
  // eslint-disable-next-line no-param-reassign
  product.id = await getProductsSequence('products');
  const result = await db.collection('products').insertOne(product);
  const savedProduct = await db
    .collection('products')
    .findOne({ _id: result.insertedId });
  return savedProduct;
}
const server = new ApolloServer({
  typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
  resolvers,
});

async function connectToDb() {
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect();
  console.log('Connected to MongoDB:', url);
  db = client.db();
}


const app = express();
server.applyMiddleware({ app, path: '/graphql', cors: enableCors });
const port = process.env.API_SERVER_PORT || 3000;


(async function start() {
  try {
    await connectToDb();
    app.listen(port, () => {
      console.log(`App started on port ${port}`);
    });
  } catch (err) {
    console.log('ERROR', err);
  }
}());
