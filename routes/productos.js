const { Router } = require('express');
const bcrypt = require('bcrypt');
//const _ = require('underscore');
const fs = require('fs');
var path = require('path');
//const nodemailer = require('nodemailer');

const Product = require('../models/products');

const router = Router();

const ProductCtrl = {};
ProductCtrl.getProducts = async(req, res) => {
    let codigo = req.params.codigo;
    await Product.find({ codigo_cuenta: codigo })
        //.populate('area', 'name')
        //.populate('codigoCM', 'name')
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            return res.status(200).json({
                ok: true,
                count: products.length,
                products
            });
        });
};

ProductCtrl.postProducts = async(req, res) => {
    let body = req.body;
    let product = new Product({
        name: body.name,
        codigo: body.codigo,
        codigo_cuenta: body.cuenta,
        precio: body.precio,
        categoria: body.categoria,
        existencias: body.existencias,
        descripcion: body.descripcion,
        userid: body.userid,
        cantidad: body.cantidad
    });

    await product.save((err, productDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.status(200).json({
            ok: true,
            productDB
        });
    });
};
/*
UserCtrl.editStatus = async(req, res) => {
    let id = req.params.id;
    let status = req.body.status
    await User.findByIdAndUpdate(id, { Status: status }, (err, user) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (status == true) {
            return res.status(200).json({
                ok: true,
                message: `${user.name} fue Activado`
            })
        }
        if (status == false) {
            return res.status(200).json({
                ok: true,
                message: `${user.name} fue Desactivado`
            })
        }

    });

};
*/
router.get('/products/:codigo', ProductCtrl.getProducts); //Ver todos los Usuarios
router.post('/product', ProductCtrl.postProducts); //Ver todos los Usuarios
//router.put('/user/:id/status', UserCtrl.editStatus); //Editar Status True/False

module.exports = router;