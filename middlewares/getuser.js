const express = require('express');
const Users = require('../models/users');
const getUsuario = express.Router();


getUsuario.use(async(req, res, next) => { //Funcion Middleware: Tomar el id de Usuario guardado en el Token para                                             // buscarlo en la base de datos y mandar los datos
    let cms = [] // separados por medio de un objeto almacenado en req.user
    let codigoCms = []
    const userid = req.userId
    await Users.findById(userid, { password: 0 })
        .populate('area', 'name')
        .populate('codigoCM', 'name')
        .exec((err, user) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (user.Status == true) {
                user.codigoCM.forEach(element => {
                    const cm = element.name
                    cms.push(cm)
                });
                user.codigoCM.forEach(element => {
                    const ccm = element._id
                    codigoCms.push(ccm)
                });
            } else {
                return res.status(401).json({
                    ok: false,
                    err
                });
            }
            req.user = {
                id: user._id,
                area: user.area,
                cm: cms,
                name: user.name,
                alias: user.alias,
                ccm: codigoCms
            }
            next();
        })


});

module.exports = { getUsuario };