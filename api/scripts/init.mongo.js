/*
 * Run using the mongo shell. For remote databases, ensure that the
 * connection string is supplied in the command line. For example:
 * localhost:
 *   mongo issuetracker scripts/init.mongo.js
 * Atlas:
 *   mongo mongodb+srv://ritu:Ghanshi%401986@cluster1-0stib.mongodb.net/productinventory
     scripts/init.mongo.js
 * MLab:
 *   mongo mongodb://user:pwd@xxx.mlab.com:33533/issuetracker
     scripts/init.mongo.js
 */
/* global db print */
/* eslint no-restricted-globals: "off" */
db.products.remove({});
const productDB = [
  {
    id: 1,
    category: 'Shirts',
    name: 'Blue Shirt',
    price: 35.00,
    image: 'https://vanheusen.partnerbrands.com/en/flex-regular-wrinkle-free-button-up-dress-shirt-20F6194?camp=PPC_PLA_Brand&gclid=CjwKCAiAy9jyBRA6EiwAeclQhGezscRCHA75G8pHj2ELSXM_-hKOW_3lXs_5NgqNSI-XVfo61yJkSxoCA70QAvD_BwE&gclsrc=aw.ds',

  },
  {
    id: 2,
    category: 'Accessories',
    name: 'Gold Earring',
    price: 65.00,
    image: 'https://www.etsy.com/listing/453173668/14k-gold-mini-hoop-earrings-14k-solid?gpla=1&gao=1&',

  },
  {
    id: 3,
    category: 'Jackets',
    name: 'Sweatshirt',
    price: 8.98,
    image: 'https://www.bulkapparel.com/fleece/hanes-p170-ecosmart-hooded-sweatshirt?gclid=CjwKCAiAy9jyBRA6EiwAeclQhDITTH_V5CVCRRF2IEKhrzUtmJtLPbghYO3hux6zuBv38kPfS9V7HxoCdtcQAvD_BwE',
  },
];
db.products.insertMany(productDB);
const count = db.products.count();
print('Inserted', count, 'products');

db.counters.remove({ _id: 'products' });
db.counters.insert({ _id: 'products', current: count });
print('Created counter');

db.products.createIndex({ id: 1 }, { unique: true });
db.products.createIndex({ category: 1 });
db.products.createIndex({ name: 1 });
db.products.createIndex({ price: 1 });
