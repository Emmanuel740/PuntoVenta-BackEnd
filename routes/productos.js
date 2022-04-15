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
ProductCtrl.getProduct = async(req, res) => {
    let codigo = req.params.codigo;
    let id = req.params.id;
    await Product.find({ "_id": id, "codigo_cuenta": codigo, })
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
        tipo_venta: body.tipoVenta,
        precio: body.precio,
        categoria: body.categoria,
        existencias: body.existencias,
        descripcion: body.descripcion,
        userid: body.userid,
        cantidad: 1
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

ProductCtrl.editProduct = async(req, res) => { //Editar Hallazgo
    const id = req.params.id //id del hallazgo
        //const hallazgo = req.body;
        //let fotografia = uploadIMG(hallazgo.fotos, hallazgo.folio, 'liq');;
        /* const ProductoEditado = { //Nuevos datos
             area: hallazgo.area,
             activities: hallazgo.activities,
             criticity: hallazgo.criticity,
             siniestro: hallazgo.siniestro
         };*/
    let nombre = req.body.nombre;
    let precio = req.body.precio;
    let existencias = parseFloat(req.body.existencias);
    let Agregarexistencias = parseFloat(req.body.Agregarexistencias);
    console.log(Agregarexistencias);
    let descripcion = req.body.descripcion;
    await Product.findByIdAndUpdate(id, {
            $set: {
                "name": nombre,
                "precio": precio,
                "existencias": existencias + Agregarexistencias,
                "descripcion": descripcion
            }
        })
        .exec((err) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            } else {
                return res.status(200).json({
                    ok: true,
                    message: `Producto actualizado`
                })
            }
        })
}
ProductCtrl.deleteProduct = async(req, res) => {
    let id = req.params.id;

    await Product.findByIdAndDelete(id, (err) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.status(200).json({
            ok: true,
            message: `Producto eliminado`
        })


    });

};
router.get('/products/:codigo', ProductCtrl.getProducts); //Ver todos los Usuarios
router.get('/product/:id/:codigo', ProductCtrl.getProduct); //Ver todos los Usuarios

router.post('/product', ProductCtrl.postProducts); //Ver todos los Usuarios
router.put('/product/:id/:cuenta', ProductCtrl.editProduct); //Ver todos los Usuarios
router.delete('/product/:id', ProductCtrl.deleteProduct); //Ver todos los Usuarios

//router.put('/user/:id/status', UserCtrl.editStatus); //Editar Status True/False

module.exports = router;