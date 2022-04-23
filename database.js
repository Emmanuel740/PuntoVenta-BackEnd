require('dotenv').config();
const mongoose = require('mongoose');
const connectionParams = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}
//const URI = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/cams?authSource=admin`;
const URI = `mongodb://localhost:27017/${process.env.DB}`;

// mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
//     .then(db => console.log('Mongodb is connected'))
//     .catch(err => console.error(err));

const conenctToLocalDB = async () => {
        try {
            await mongoose.connect(URI, connectionParams)
            console.log('Connection local database correct')
        } catch {
            (error)
            console.log(error)
            throw new Error('Error check db')
    
    
        }
    }
const connectToAtlas = () => {
        let url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uw13s.mongodb.net/puntoVenta?retryWrites=true&w=majority`;
        //let url = 'mongodb+srv://admin:wMMWWz1FUSXB6SaI@cluster0.uw13s.mongodb.net/puntoVenta?retryWrites=true&w=majority'
        mongoose.connect(url, connectionParams)
            .then(() => {
                console.log('Connected to database cluster')
            })
            .catch((err) => {
                console.error(`Error connecting to the database. \n${err}`);
            })
}
// module.exports = mongoose;

module.exports = {
    connectToAtlas,
    conenctToLocalDB,
};