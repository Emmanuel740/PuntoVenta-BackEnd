require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const rutasProtegidas = express.Router();


rutasProtegidas.use((req, res, next) => {

    if (!req.headers.access) {
        return res.status(401).send('Unathorize Request 1');
    }

    const token = req.headers.access.split(' ')[1];
    if (token === 'null') {
        return res.status(401).send('Unathorize Request 2');
    }

    jwt.verify(token, process.env.SEED, (err) => {
        if (err) {
            return res.json({
                mensaje: 'Token inválida',
                err
            });
        }
    });
    const payload = jwt.verify(token, process.env.SEED);
    req.userId = payload.user

    next();
});

module.exports = { rutasProtegidas };