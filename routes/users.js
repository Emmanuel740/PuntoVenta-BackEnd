const { Router } = require('express');
const bcrypt = require('bcrypt');
//const _ = require('underscore');
const fs = require('fs');
var path = require('path');
//const nodemailer = require('nodemailer');

const User = require('../models/users');

const router = Router();

const UserCtrl = {};
UserCtrl.getUsers = async(req, res) => {
    let codigo = parseInt(req.params.codigo);
    await User.aggregate([{
            $match: {
                "cuentas.codigo_cuenta": { $eq: codigo }
            }
        }, ])
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            return res.status(200).json({
                ok: true,
                count: users.length,
                users
            });
        });
};
UserCtrl.getUser = async(req, res) => {
    let id = parseInt(req.params.id);
    await User.aggregate([{
            $match: {
                "_id": { $eq: id }
            }
        },
        {
            $lookup: {
                from: "cuentas",
                localField: "cuentas.codigo_cuenta",
                foreignField: "codigo_cuenta",
                as: "cuentas"
            }
        },
    ])

    //.populate('codigoCM', 'name')
    .exec((err, user) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.status(200).json({
            ok: true,
            count: user.length,
            user
        });
    });
};

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
UserCtrl.editUser = async(req, res) => {
    let id = req.params.id;
    let body = req.body;
    //let status = req.body.status

    let name = body.name;
    let telefono = body.telefono;
    let userName = body.userName;
    if(body.password === ''){
        await User.findByIdAndUpdate(id, {
            name: name,
            telefono: telefono,
            userName: userName
    
        }, (err, user) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
    
            return res.status(200).json({
                ok: true,
                message: `${user.name} fue editado con exito`
            })
    
    
        });
    }else{
        await User.findByIdAndUpdate(id, {
            name: name,
            telefono: telefono,
            userName: userName,
            password: bcrypt.hashSync(body.password, 10)
    
        }, (err, user) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
    
            return res.status(200).json({
                ok: true,
                message: `${user.name} fue editado con exito`
            })
    
    
        });
    }
    

};

UserCtrl.postUser = async(req, res) => {
    let body = req.body;
    let user = new User({
        Status: true,
        name: body.name,
        rol: body.rol,
        telefono: body.telefono,
        cuentas: {
            codigo_cuenta: body.cuenta,

        },
        userName: body.userName,
        password: bcrypt.hashSync(body.password, 10),
    });

    await user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.status(200).json({
            ok: true,
            message: `El usuario ${body.name} ha sido creado`
        });
    });
};
UserCtrl.deleteUser = async(req, res) => {
    let id = req.params.id;

    await User.findByIdAndDelete(id, (err) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.status(200).json({
            ok: true,
            message: `Usuario eliminado`
        })


    });

};
router.get('/users/:codigo', UserCtrl.getUsers); //Ver todos los Usuarios
router.get('/user/:id', UserCtrl.getUser); //Ver un Usuario
router.put('/user/:id/status', UserCtrl.editStatus); //Editar Status True/False
router.put('/user/:id', UserCtrl.editUser); //Editar Status True/False
router.post('/user', UserCtrl.postUser); //Editar Status True/False
router.delete('/user/:id', UserCtrl.deleteUser); //Editar Status True/False


module.exports = router;