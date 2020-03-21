require('dotenv').config();
const { MongoClient } = require('mongodb');

const url = process.env.DB_URL || 'mongodb+srv://ritu:Ghanshi%401986@cluster1-0stib.mongodb.net/productinventory?retryWrites=true&w=majority';
// Atlas URL  - replace UUU with user, PPP with password, XXX with hostname
// const url = 'mongodb+srv://UUU:PPP@cluster0-XXX.mongodb.net/issuetracker?retryWrites=true';
// mLab URL - replace UUU with user, PPP with password, XXX with hostname
// const url = 'mongodb://UUU:PPP@XXX.mlab.com:33533/issuetracker';
function testWithCallbacks(callback) {
  console.log('\n--- testWithCallbacks ---');
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  client.connect((connErr) => {
    if (connErr) {
      callback(connErr);
      return;
    }
    console.log('Connected to MongoDB URL', url);
    const db = client.db();
    const collection = db.collection('products');
    const product = { id: 2, name: 'A. Callback', price: 23 };
    collection.insertOne(product, (insertErr, result) => {
      if (insertErr) {
        client.close();
        callback(insertErr);
        return;
      }
      console.log('Result of insert:\n', result.insertedId);
      collection.find({ _id: result.insertedId })
        // eslint-disable-next-line no-unused-vars
        .toArray((findErr, docs) => {
          if (findErr) {
            client.close();
            callback(findErr);
            // eslint-disable-next-line no-useless-return
            return;
          }
        });
      // eslint-disable-next-line no-undef
      console.log('Result of find:\n', docs);
      client.close();
      callback();
    });
  });
}

async function testWithAsync() {
  console.log('\n--- testWithAsync ---');
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    console.log('Connected to MongoDB URL', url);
    const db = client.db();
    const collection = db.collection('products');
    const product = { id: 3, name: 'B. Async', price: 20 };
    const result = await collection.insertOne(product);
    console.log('Result of insert:\n', result.insertedId);
    const docs = await collection.find({ _id: result.insertedId })
      .toArray();
    console.log('Result of find:\n', docs);
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }
}
testWithCallbacks((err) => {
  if (err) {
    console.log(err);
  }
  testWithAsync();
});
