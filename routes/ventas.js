const { Router } = require('express');
const bcrypt = require('bcrypt');
//const _ = require('underscore');
const fs = require('fs');
var path = require('path');
//const nodemailer = require('nodemailer');

const Venta = require('../models/ventas');
const Producto = require('../models/products');


const router = Router();

const ventaCtrl = {};

ventaCtrl.getVentas = async(req, res) => {
    let userid = req.params.id;
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let codigo = req.params.codigo;
    console.log(year + '-' + month + '-' + day);
    console.log(date | 'YYYY-MM-dd')
    await Venta.find({ "fecha": { "$gt": `${year}-${month}-${day}` }, "userid": userid, "codigo_cuenta": codigo })
        //await Venta.find({ "fecha": { "$gt": `` } })
        .populate('productos.producto', ['name', 'precio'])
        //.populate('productos.producto', 'precio')
        //.populate('codigoCM', 'name')
        .exec((err, ventas) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            return res.status(200).json({
                ok: true,
                count: ventas.length,
                ventas
            });
        });
};

ventaCtrl.getVentasTotales = async(req, res) => {
    //let userid = req.params.id;
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let codigo = req.params.codigo;
    console.log(year + '-' + month + '-' + day);
    console.log(date | 'YYYY-MM-dd')
    await Venta.find({ "fecha": { "$gt": `${year}-${month}-${day}` }, "codigo_cuenta": codigo })
        //await Venta.find({ "fecha": { "$gt": `` } })
        .populate('productos.producto', ['name', 'precio'])
        //.populate('productos.producto', 'precio')
        //.populate('codigoCM', 'name')
        .exec((err, ventas) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            return res.status(200).json({
                ok: true,
                count: ventas.length,
                ventas
            });
        });
};

ventaCtrl.postVentas = async(req, res) => {
    let body = req.body;
    let venta = new Venta({
        productos: body.productos,
        total: body.total,
        userid: body.userid,
        fecha: body.fecha,
        codigo_cuenta: body.cuenta
    });

    await venta.save((err, ventaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (res) {
            for (let producto of body.productos) {
                console.log(producto);
                let id = producto.producto
                let nuevasExistencias = producto.existencias - producto.cantidad
                Producto.findByIdAndUpdate(id, {
                    $set: {
                        existencias: nuevasExistencias

                    }
                }).exec((err, res) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(res);
                    }
                })
            }
        }


        return res.status(200).json({
            ok: true,
            ventaDB
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
router.get('/venta/:id/:codigo', ventaCtrl.getVentas); //Ver ventas del dia de un usuario
router.get('/venta/:codigo', ventaCtrl.getVentasTotales); //Ver todas las ventas del dia
router.post('/venta', ventaCtrl.postVentas); //Ver todos los Usuarios
//router.put('/user/:id/status', UserCtrl.editStatus); //Editar Status True/False

module.exports = router;