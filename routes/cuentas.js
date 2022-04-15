const { Router } = require('express');
const router = Router();
const bcrypt = require('bcrypt');
const fs = require('fs');

const User = require('../models/users');
const Cuenta = require('../models/cuentas');


const CuentaCtrl = {};



CuentaCtrl.addCuenta = async(req, res) => {
    let body = req.body;
    //let imgName = body.alias + body.expediente
    // let fotografia = uploadIMG(body.avatar, imgName);
    let codigo;
    let date = new Date();
    //if (body.rol === 'administrador') {

    let month = date.getMonth();
    let day = date.getDate()
    let hour = date.getHours()
    let seconds = date.getSeconds();
    codigo = parseInt(`${month}${day}${hour}${seconds}`);

    let cuenta = new Cuenta({
        codigo_cuenta: codigo,
        userid: body.userid,
        nombre: body.nombreCuenta,
        fecha: date,
    });
    await cuenta.save((err, cntDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });

        } else {
            User.updateOne({ "_id": body.userid }, {
                $push: {
                    cuentas: {
                        $each: [{ "codigo_cuenta": codigo }]
                    }
                }
            }).exec((err) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                return res.status(200).json({
                    ok: true,
                    message: `${body.nombreCuenta} ha sido creada con exíto!`

                });
            });
        }

    });
    /*
        console.log(day);
        console.log(hour);
        console.log(seconds);
        console.log(codigo);
        let user = new User({
            Status: true,
            name: body.name,
            rol: body.rol,
            telefono: body.telefono,
            cuentas: {
                codigo_cuenta: codigo,

            },
            userName: body.userName,
            password: bcrypt.hashSync(body.password, 10),
        });
        await user.save((err, usrDB) => {
            if (err) {
                Cuenta.deleteOne({ codigo: codigo }).exec((res) => {
                    console.log('entro');
                })
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            return res.status(200).json({
                ok: true,
                usrDB
            });


        });
    } else {
        if (body.rol === 'despachador') {
            let user = new User({
                name: body.name,
                rol: body.rol,
                telefono: body.telefono,
                cuentas: {
                    codigo_cuenta: codigo
                },
                userName: body.userName,
                password: bcrypt.hashSync(body.password, 10),
            });
            await user.save((err, usrDB) => {
                if (err) {
                    Cuenta.deleteOne({ codigo: codigo }).exec((res) => {
                        console.log('entro');
                    })
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                return res.status(200).json({
                    ok: true,
                    usrDB
                });


            });
        }
    }*/

};

//router.get('/signup', SignUpCtrl.getCM); //Obtener CMs para select 
router.post('/crearCuenta', CuentaCtrl.addCuenta); //Nueva cuenta
//router.post('/crearCuenta', CuentaCtrl.addCuenta); //Consultar cuenta


module.exports = router;