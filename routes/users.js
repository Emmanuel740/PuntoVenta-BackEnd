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
    let codigo = req.params.codigo;
    await User.find({ codigo_cuenta: codigo })
        //.populate('area', 'name')
        //.populate('codigoCM', 'name')
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
    let id = req.params.id;
    await User.find({ "_id": id })
        //.populate('area', 'name')
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
router.get('/users/:codigo', UserCtrl.getUsers); //Ver todos los Usuarios
router.get('/user/:id', UserCtrl.getUser); //Ver un Usuario
router.put('/user/:id/status', UserCtrl.editStatus); //Editar Status True/False

module.exports = router;