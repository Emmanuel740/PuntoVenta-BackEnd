const { Router } = require('express');
const bcrypt = require('bcrypt');
//const _ = require('underscore');
const fs = require('fs');
var path = require('path');
//const nodemailer = require('nodemailer');

const Category = require('../models/categories');

const router = Router();

const CategoryCtrl = {};
CategoryCtrl.getCategories = async(req, res) => {
    let codigo = req.params.codigo
    await Category.find({ codigo_cuenta: codigo })
        //.populate('area', 'name')
        //.populate('codigoCM', 'name')
        .exec((err, categories) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            return res.status(200).json({
                ok: true,
                count: categories.length,
                categories
            });
        });
};

CategoryCtrl.postCategories = async(req, res) => {
    let body = req.body;
    let category = new Category({
        name: body.name,
        userid: body.userid,
        codigo_cuenta: body.cuenta

    });

    await category.save((err, categoryDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.status(200).json({
            ok: true,
            categoryDB
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
router.get('/categories/:codigo', CategoryCtrl.getCategories); //Ver todos los Usuarios
router.post('/category', CategoryCtrl.postCategories); //Ver todos los Usuarios
//router.put('/user/:id/status', UserCtrl.editStatus); //Editar Status True/False

module.exports = router;