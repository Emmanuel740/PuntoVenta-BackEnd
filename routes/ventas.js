const { Router } = require('express');
const bcrypt = require('bcrypt');
const fs = require('fs');
var path = require('path');
const Venta = require('../models/ventas');
const Producto = require('../models/products');
const router = Router();
const ventaCtrl = {};
const Log = require('../models/logs');

ventaCtrl.getVentas = async(req, res) => {
    let userid = req.params.id;
    let corte = req.params.corte;
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let codigo = req.params.codigo;
    console.log(year + '-' + month + '-' + day);
    console.log(date | 'YYYY-MM-dd')
    await Venta.find({ "fecha": { "$gt": `${year}-${month}-${day}` }, "userid": userid, "codigo_cuenta": codigo, "corte": corte })
        .populate('productos.producto', ['name', 'precio', 'tipo_venta'])
        .populate('userid', ['name'])
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

ventaCtrl.getVentasUsuario = async(req, res) => {
    let userid = req.params.id;
    let corte = req.params.corte;
    let fecha = req.params.fecha;
    let date = new Date(fecha);
    console.log(date);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    let codigo = req.params.codigo;

    let fecha1 = `${year}-0${month}-${day}T00:00:00.000Z`;
    let fecha2 = `${year}-0${month}-${day}T23:59:59.999Z`;
    console.log('fecha: ' + fecha);

    await Venta.find({ "fecha": { "$gte": new Date(fecha1), "$lte": new Date(fecha2) }, "userid": userid, "codigo_cuenta": codigo })
        .populate('productos.producto', ['name', 'precio', 'tipo_venta'])
        .populate('userid', ['name'])
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

ventaCtrl.getVentasTotalesFecha = async(req, res) => {
    let fecha = req.params.fecha;
    let corte = req.params.corte;
    let date = new Date(fecha);
    console.log(date);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let codigo = req.params.codigo;
    console.log(year + '-' + month + '-' + day);
    let fecha1 = `${year}-0${month}-${day}T00:00:00.000Z`;
    let fecha2 = `${year}-0${month}-${day}T23:59:59.999Z`;
    console.log('fecha1: ' + fecha1);
    console.log('fecha2: ' + fecha2);

    await Venta.find({ "fecha": { "$gte": new Date(fecha1), "$lte": new Date(fecha2) }, "codigo_cuenta": codigo })
        .populate('productos.producto', ['name', 'precio', 'tipo_venta'])
        .populate('userid', ['name'])
        .exec((err, ventas) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'error carnal',
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

ventaCtrl.getVenta = async(req, res) => {
    let id = req.params.id;
    let codigo = req.params.codigo;
    await Venta.find({ "_id": id, "codigo_cuenta": codigo })
        .populate('productos.producto')
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
    let corte = req.params.corte;
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let codigo = req.params.codigo;
    console.log(year + '-' + month + '-' + day);
    console.log(date | 'YYYY-MM-dd')
    await Venta.find({ "fecha": { "$gt": `${year}-${month}-${day}` }, "codigo_cuenta": codigo, "corte": false, "corte": corte })
        .populate('productos.producto', ['name', 'precio', 'tipo_venta'])
        .populate('userid', ['name'])
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
async function logVenta(host, userName, date, method, originalurl, path, httpVersion, code, app, disp, body) {

    let archivo = new Log({
        host: host,
        usuario: userName,
        date,
        peticion: `${method} ${originalurl}${path} HTTP ${httpVersion} ${code}`,
        sitio: app,
        dispositivo: disp,
        valores: body
    });
    await archivo.save((err, logDB) => {
        if (err) {
            console.log(err)
        }
        //console.log(logBD);
    });


}

ventaCtrl.postVentas = async(req, res) => {
    let date = new Date();
    let host = req.ip;
    let body = req.body;
    console.log('//////' + body.productos + '//////')
    let venta = new Venta({
        productos: body.productos,
        total: body.total,
        userid: body.userid,
        fecha: body.fecha,
        codigo_cuenta: body.cuenta
    });

    await venta.save((err, ventaDB) => {
        if (err) {
            logVenta(host, body.userid, date, req.method, req.originalUrl, req.path, req.httpVersion, 400, 'Fastore', req.rawHeaders[9], body);

            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (res) {
            logVenta(host, body.userid, date, req.method, req.originalUrl, req.path, req.httpVersion, 200, 'Fastore', req.rawHeaders[9], body);

            for (let producto of body.productos) {
                console.log(producto);
                let id = producto.producto
                let nuevasExistencias = producto.existencias - producto.cantidad
                let ex = Number.parseFloat(nuevasExistencias).toFixed(2);
                console.log(ex);
                Producto.findByIdAndUpdate(id, {
                    $set: {
                        existencias: ex

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


ventaCtrl.postDevolucion = async(req, res) => {
    let body = req.body;
    let productosAnteriores = [];

    Venta.find({ "_id": body.id })
        .populate('productos.producto')
        .exec((err, ventas) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            productosAnteriores = ventas[0].productos;

        });


    for (let producto of productosAnteriores) {
        console.log(producto);
        let id = producto.producto
        let viejasExistencias = parseInt(producto.producto.existencias + producto.cantidad);
        Producto.findByIdAndUpdate(id, {
            $set: {
                existencias: viejasExistencias

            }
        }).exec((err) => {
            if (err) {
                console.log(err);
                return res.status(400).json({
                    ok: false,
                    err
                });
            } else {
                //console.log(res);
            }
        })
    }

    Venta.findByIdAndUpdate(body.id, {
        $set: {
            "productos": body.productosNuevos,
            "total": body.total,
            //userid: body.userid,
            "fecha": body.fecha,

        }
    }).exec((err) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                ok: false,
                err
            });
        } else {
            console.log(res);
            for (let producto of body.productosNuevos) {
                console.log(producto);
                let id = producto.producto
                let nuevasExistencias = parseInt(producto.producto.existencias - producto.cantidad);
                Producto.findByIdAndUpdate(id, {
                    $set: {
                        existencias: nuevasExistencias

                    }
                }).exec((err) => {
                    if (err) {
                        console.log(err);
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    } else {
                        //console.log(res);
                    }
                })
            }
            return res.status(200).json({
                ok: true,
                message: 'Se han guardado los cambios'
            });
        }
    });





};
router.get('/ventas/:id/:codigo/:corte', ventaCtrl.getVentas); //Ver ventas del dia de un usuario
router.get('/ventas/:codigo/:corte', ventaCtrl.getVentasTotales); //Ver todas las ventas del dia
router.get('/venta/:id/:codigo', ventaCtrl.getVenta); //Ver una venta
router.post('/venta', ventaCtrl.postVentas); //Realizar una venta
router.post('/devolucion', ventaCtrl.postDevolucion); //Realizar una devolucion
router.get('/ventas/usuario/:id/:codigo/:fecha', ventaCtrl.getVentasUsuario); //Ver ventas de un usuario por fecha
router.get('/ventasTotalesFecha/:codigo/:fecha', ventaCtrl.getVentasTotalesFecha); //Ver ventas totales por fecha


module.exports = router;