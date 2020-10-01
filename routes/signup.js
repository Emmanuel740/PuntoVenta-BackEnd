const { Router } = require('express');
const router = Router();
const bcrypt = require('bcrypt');
const fs = require('fs');

const User = require('../models/users');
const Cuenta = require('../models/cuentas');

//const CM = require('../models/CM');

const SignUpCtrl = {};
/*
function uploadIMG(foto, user) {
    if (foto == null) {
        fotografia = "../imagenes/user/00_no_picture.png";
        return fotografia
    } else {
        var Img = foto.replace(/^data:image\/jpeg;base64,/, "");
        let fotografia = `${user}.jpg`;
        fs.writeFile(fotografia, Img, 'base64', function(err) {
            if (err) { console.log(err) } // writes out file without error, but it's not a valid image         
        });
        return fotografia
    }
}
*/


SignUpCtrl.addUser = async(req, res) => {
    let body = req.body;
    //let imgName = body.alias + body.expediente
    // let fotografia = uploadIMG(body.avatar, imgName);
    let codigo;
    let date = new Date();
    if (body.rol === 'administrador') {

        let month = date.getMonth();
        let day = date.getDate()
        let hour = date.getHours()
        let seconds = date.getSeconds();
        codigo = `${month}${day}${hour}${seconds}`;
        let cuenta = new Cuenta({
            codigo: codigo,
            userid: body.userid,
            fecha: date,
        });
        await cuenta.save((err, cntDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });

            }

        });
        console.log(day);
        console.log(hour);
        console.log(seconds);
        console.log(codigo);
        let user = new User({
            Status: true,
            name: body.name,
            rol: body.rol,
            telefono: body.telefono,
            codigo_cuenta: codigo,
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
                codigo_cuenta: body.codigo,
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
    }

};

//router.get('/signup', SignUpCtrl.getCM); //Obtener CMs para select 
router.post('/signup', SignUpCtrl.addUser); //Nuevo Usuario

module.exports = router;