const fs = require('fs');
require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { MongoClient } = require('mongodb');

const url = process.env.DB_URL || 'mongodb+srv://ritu:Ghanshi%401986@cluster1-0stib.mongodb.net/productinventory?retryWrites=true&w=majority';
// const url = process.env.DB_URL;
let db;
// const port = process.env.API_SERVER_PORT || 3000;

// let aboutMessage = 'Product Inventory API v1.0';

const resolvers = {
  Query: {
    // eslint-disable-next-line no-use-before-define
    productList,
  },
  Mutation: {
    // eslint-disable-next-line no-use-before-define
    addProduct,
  },
};

// const productDB = [
//   {
//     id: 1, category: 'Shirts', name: 'Blue Shirt', price: 34.00, image: 'https://vanheusen.partnerbrands.com/en/flex-regular-wrinkle-free-button-up-dress-shirt-20F6194?camp=PPC_PLA_Brand&gclid=CjwKCAiAy9jyBRA6EiwAeclQhGezscRCHA75G8pHj2ELSXM_-hKOW_3lXs_5NgqNSI-XVfo61yJkSxoCA70QAvD_BwE&gclsrc=aw.ds',
//   },
//   {
//     id: 2, category: 'Accessories', name: 'Gold Earring', price: 64.00, image: 'https://www.etsy.com/listing/453173668/14k-gold-mini-hoop-earrings-14k-solid?gpla=1&gao=1&',
//   },
//   {
//     id: 3, category: 'Jackets', name: 'Sweatshirt', price: 7.98, image: 'https://www.bulkapparel.com/fleece/hanes-p170-ecosmart-hooded-sweatshirt?gclid=CjwKCAiAy9jyBRA6EiwAeclQhDITTH_V5CVCRRF2IEKhrzUtmJtLPbghYO3hux6zuBv38kPfS9V7HxoCdtcQAvD_BwE',
//   },
// ];


// const enableCors = (process.env.ENABLE_CORS || 'true') === 'true';
// console.log('CORS setting:', enableCors);


// function setAboutMessage(_, { message }) {
//   // eslint-disable-next-line no-return-assign
//   return aboutMessage = message;
// }

async function productList() {
  const products = await db
    .collection('products')
    .find()
    .toArray();
  return products;
//   return productDB;
}

async function getProductsCount(name) {
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
  product.id = await getProductsCount('products');
  const result = await db.collection('products').insertOne(product);
  const savedProduct = await db
    .collection('products')
    .findOne({ _id: result.insertedId });
  return savedProduct;
  //   product.id = productDB.length + 1;
  //   productDB.push(product);
  //   return product;
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

// app.use(express.static('public'));
const app = express();
server.applyMiddleware({ app, path: '/graphql' });
const port = process.env.API_SERVER_PORT || 3000;
// app.listen(port, () => {
//   console.log(`API server started on port ${port}`);
// });

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
