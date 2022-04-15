require('dotenv').config();
const express = require('./node_modules/express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

//SETTINGS
//const config = require('./config/config');
const { mongoose } = require('./database');


//CORS - TOKEN
app.use(cors());
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader(
//         'Access-Control-Allow-Headers',
//         'Origin, X-Requested-With, Content-Type, Accept, access, token'
//     );
//     res.setHeader(
//         'Access-Control-Allow-Methods',
//         'GET, POST, PATCH, PUT, DELETE, OPTIONS'
//     );
//     next();
// });

//MIDDLEWARES 
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use(express.json({ limit: '5mb' }));

//ROUTES
app.get('/', (req, res) => {
    res.send('<h1>Punto de Venta</h1>');
});
app.use('/api', require('./routes/index.routes'));

app.get('*', function(req, res) { //Error 404
    res.status(404).json({
        message: 'Ruta no existe'
    });
});

//SERVER
app.listen(process.env.PORT, () => {
    console.log(`server on port ${process.env.PORT}`)
})