require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

//MODEL OF BD
const User = require('../models/users');
//const mail = require('../mail/passrestored')

const app = express();

app.get('/login', (req, res) => {
    res.send('<h1>LOGIN</h1>');
});

app.post('/login', async(req, res) => {

    const { userName, password } = req.body;
    const user = await User.findOne({ userName: userName });
    if (!user) return res.status(401).send("Usuario y/o Contraseña incorrecto");
    if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).send("Usuario y/o Contraseña incorrecto");
    }

    if (user.Status == true) {
        const payload = { //Para guardar ID de usuario
            check: true,
            user: user._id
        };

        const token = jwt.sign(payload, process.env.SEED, {
            expiresIn: 86400
        });

        res.json({
            mensaje: 'Correct Authentication',
            token: token,
            user
        });
    } else {
        return res.status(401).send("Usuario y/o Contraseña incorrecto");
    }


});
/*
app.post('/login/forgot', async(req, res) => { //Recuperar contraseña

    const parametro = req.body.parametro;
    const valor = req.body.valor;

    if (parametro == 'email') { //Con email

        const user = await User.findOne({ email: valor });
        if (!user) return res.status(400).send("Invalid Data");
        return res.send(sendAMail(user))
    }

    if (parametro == 'numEmpleado') { //Con numero de Empleado
        const user = await User.findOne({ expediente: valor });

        if (!user) return res.status(400).send("Invalid Data");

        return res.send(sendAMail(user))
    }

    //Mandar Mail
    async function sendAMail(user) {
        let oldPass = user.password; //Obtener contraseña y generar nueva
        oldPass = oldPass.substr(3, 8);
        const newPass = bcrypt.hashSync(oldPass, 10);
        await User.findByIdAndUpdate(user._id, { password: newPass });

        const transporter = nodemailer.createTransport({ //Datos del SMTP 
            host: 'smtp.office365.com',
            port: 587,
            secure: false,
            auth: {
                user: 'camssoporte@hotmail.com',
                pass: process.env.EMAIL_PASS
            },
            tls: {
                ciphers: 'SSLv3'
            }
        });

        const emailHTML = mail.mail(user.name, oldPass)
        const info = await transporter.sendMail({ //Mail
            from: '"CAMS Soporte" <camssoporte@hotmail.com>',
            to: user.email,
            subject: 'Recuperar Contraseña',
            html: emailHTML
        });
        console.log(info.messageId)
        return 'Message sent';
    }
})
*/
module.exports = app;