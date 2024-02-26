const mongoose = require('mongoose');
const initData = require('./data.js');
const listing = require('../models/listing.js');


const MONGO_URL = 'mongodb://127.0.0.1:27017/wonderlust';

main ()
  .then (result => {
    console.log ('connecetd to the db');
  })
  .catch (err => {
    console.log (err);
  });

async function main () {
  await mongoose.connect (MONGO_URL);
}


const initDB= async()=>{
     await listing.deleteMany({});
    initData.data= initData.data.map((obj)=>({...obj,owner:'65d8658a92765e62ab415600'}));
     await listing.insertMany(initData.data)
     console.log("data was inintiazed");
};

initDB();