require('dotenv').config();
const mongoose = require('mongoose');

//const URI = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/cams?authSource=admin`;
const URI = `mongodb://localhost:27017/${process.env.DB}`;

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
    .then(db => console.log('Mongodb is connected'))
    .catch(err => console.error(err));

module.exports = mongoose;