const { Router } = require('express');
const bcrypt = require('bcrypt');
//const _ = require('underscore');
const fs = require('fs');
var path = require('path');
//const nodemailer = require('nodemailer');
const Venta = require('../models/ventas');
const Corte = require('../models/cortes');
const router = Router();
const corteCtrl = {};

corteCtrl.postCorte = async(req, res) => {
    let body = req.body;
    console.log(body.ventas)
    let corte = new Corte({
        userid: body.userid,
        fechaCorte: body.fecha,
        codigo_cuenta: body.cuenta,
        ventasCorte: body.ventas,
        total: body.total,
        usuarioCorte: body.usuarioCorte
    });

    await corte.save((err, corteDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (res) {
            for (let venta of body.ventas) {
                console.log(venta.id);
                let id = venta.id
                    // let nuevasExistencias = producto.existencias - producto.cantidad
                    // let ex = Number.parseFloat(nuevasExistencias).toFixed(2);
                    // console.log(ex);
                Venta.findByIdAndUpdate(id, {
                    $set: {
                        corte: true
                            // fechaCorte: fecha

                    }
                }).exec((err, res) => {
                    if (err) {
                        console.log(err);
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    } else {
                        console.log(res);
                    }
                });
            }
        }


        return res.status(200).json({
            ok: true,
            corteDB
        });
    });
};
corteCtrl.getCortes = async(req, res) => {
    let fecha = req.params.fecha;
    let corte = req.params.corte;
    let date = new Date(fecha);
    console.log(date);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let codigo = req.params.codigo;
    console.log(year + '-' + month + '-' + day);
    let fecha1 = `${year}-0${month}-0${day}T00:00:00.000Z`;
    let fecha2 = `${year}-0${month}-0${day}T23:59:59.999Z`;
    console.log('fecha1: ' + fecha1);
    console.log('fecha2: ' + fecha2);

    await Corte.find({ "fechaCorte": { "$gte": new Date(fecha1), "$lte": new Date(fecha2) }, "codigo_cuenta": codigo })
        .populate('ventasCorte.id', ['id', 'fecha', 'total', 'productos'])
        //.populate('ventasCorte.id.productos.producto', ['name', 'precio'])
        .populate('userid', ['name'])
        .populate('usuarioCorte', ['name'])
        .exec((err, cortes) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'error carnal',
                    err
                });
            }
            return res.status(200).json({
                ok: true,
                count: cortes.length,
                cortes
            });
        });
};

corteCtrl.getCorte = async(req, res) => {
    // let fecha = req.params.fecha;
    // let corte = req.params.corte;
    // let date = new Date(fecha);
    // console.log(date);
    // let year = date.getFullYear();
    // let month = date.getMonth() + 1;
    // let day = date.getDate();
    let codigo = req.params.codigo;
    let id = req.params.id;

    //console.log(year + '-' + month + '-' + day);
    //let fecha1 = `${year}-0${month}-0${day}T00:00:00.000Z`;
    //let fecha2 = `${year}-0${month}-0${day}T23:59:59.999Z`;
    //console.log('fecha1: ' + fecha1);
    //console.log('fecha2: ' + fecha2);

    await Corte.find({ "codigo_cuenta": codigo, "_id": id })
        .populate('ventasCorte.id', ['id', 'fecha', 'total', 'productos'])
        // .populate('productos)
        .populate('userid', ['name'])
        .populate('usuarioCorte', ['name'])
        .exec((err, cortes) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'error carnal',
                    err
                });
            }
            return res.status(200).json({
                ok: true,
                count: cortes.length,
                corte
            });
        });
};

router.post('/corte', corteCtrl.postCorte); //Realizar Nuevo corte
router.get('/cortes/:codigo/:fecha', corteCtrl.getCortes); //Ver cortes de un dia
router.get('/corte/:codigo/:id', corteCtrl.getCorte); //Ver cortes de un dia


module.exports = router;