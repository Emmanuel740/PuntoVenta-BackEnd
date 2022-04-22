require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const fs = require('fs');

//MODEL OF BD
const User = require('../models/users');
const Log = require('../models/logs');
const mail = require('../mail/passrestored')
const app = express();

app.get('/login', (req, res) => {
    res.send('<h1>LOGIN</h1>');
});

async function logLogin(host, userName, date, method, originalurl, path, httpVersion, code, app, disp) {
    const log = ` ${host} ${userName} ${date} ${method} ${originalurl}${path} HTTP ${httpVersion} ${code} ${app} ${disp} \n`;
    fs.appendFile(`./logs/LoginLOGS.txt`, log, function(err) {
        if (err) return console.log(err);
        console.log('archivo log creado');
    });

    let archivo = new Log({
        host: host,
        usuario: userName,
        date,
        peticion: `${method} ${originalurl}${path} HTTP ${httpVersion} ${code}`,
        sitio: app,
        dispositivo: disp
    });
    await archivo.save((err, logDB) => {
        if (err) {
            console.log(err)
        }
        //console.log(logBD);
    });


}
app.post('/login', async(req, res) => {
    const { userName, password } = req.body;

    let date = new Date();
    let host = req.ip;

    console.log(req.body);


    const usr = await User.aggregate([{
            $match: {
                "userName": { $eq: userName }
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
    ]);
    console.log(usr);
    if (usr.length === 0) {
        console.log('entra')
        logLogin(host, userName, date, req.method, req.originalUrl, req.path, req.httpVersion, 400, 'Fastore', req.rawHeaders[9]);
        return res.status(401).send("*Usuario y/o Contraseña incorrecto");
    }
    if (!bcrypt.compareSync(password, usr[0].password)) {
        // const log = ` ${host} ${userName} ${date} ${req.method} ${req.originalUrl}${req.path} HTTP ${req.httpVersion} 400 FastSellApp ${req.rawHeaders[9]}\n`;
        // logLogin(log);
        logLogin(host, userName, date, req.method, req.originalUrl, req.path, req.httpVersion, 400, 'Fastore', req.rawHeaders[9]);

        return res.status(401).send("Usuario y/o *Contraseña incorrecto");

    }

    if (usr[0].Status == true) {
        // const log = ` ${host} ${userName} ${date} ${req.method} ${req.originalUrl}${req.path} HTTP ${req.httpVersion} 200 FastSellApp ${req.rawHeaders[9]}\n`;
        // logLogin(log);
        logLogin(host, userName, date, req.method, req.originalUrl, req.path, req.httpVersion, 200, 'Fastore', req.rawHeaders[9]);

        const payload = { //Para guardar ID de usuario
            check: true,
            user: usr._id
        };

        const token = jwt.sign(payload, process.env.SEED, {
            expiresIn: 86400
        });
        let user = {
            Status: usr[0].Status,
            cuentas: usr[0].cuentas,
            name: usr[0].name,
            rol:usr[0].rol,
            _id: usr[0]._id
        }
        res.json({
            mensaje: 'Correct Authentication',
            token: token,
            user,
            logeado: true
        });


    } else {
        return res.status(401).send("Usuario y/o Contraseña incorrecto");
    }


});

app.post('/login/forgot', async(req, res) => { //Recuperar contraseña

    const parametro = req.body.parametro;
    const valor = req.body.valor;

    if (parametro == 'email') { //Con email

        const user = await User.findOne({ userName: valor });
        if (!user) return res.status(400).send("Correo Inexistente");
        return res.send(sendAMail(user))
    }


    //Mandar Mail
    async function sendAMail(user) {
        let oldPass = user.password; //Obtener contraseña y generar nueva
        oldPass = oldPass.substr(3, 8);
        const newPass = bcrypt.hashSync(oldPass, 10);
        await User.findByIdAndUpdate(user._id, { password: newPass });

        const transporter = nodemailer.createTransport({ //Datos del SMTP 
            service: 'Gmail',
            auth: {
                user: 'ortizdeluna74@gmail.com',
                pass: 'jesusemmanuel74'
            }
            // host: 'smtp.office365.com',
            // port: 587,
            // secure: false,
            // auth: {
            //     user: 'camssoporte@hotmail.com',
            //     pass: process.env.EMAIL_PASS
            // },
            // tls: {
            //     ciphers: 'SSLv3'
            // }
        });

        const emailHTML = mail.mail(user.name, oldPass)
        const info = await transporter.sendMail({ //Mail
            from: '"Fastsell" <ortizdeluna74@gmail.com>',
            to: user.userName,
            subject: 'Recuperar Contraseña',
            html: emailHTML
        });
        console.log(info.messageId)
        return 'Message sent';
    }
});
module.exports = app;