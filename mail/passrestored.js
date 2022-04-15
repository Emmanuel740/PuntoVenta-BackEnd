const mail = (name, pass) => {
    let email = `
    <div style="padding: 10px 15px; background-color: rgb(226, 220, 220); font-family:Verdana, Geneva, Tahoma, sans-serif">
        <div style="box-shadow: 0 0px 34px 6px rgba(0, 0, 0, 0.5); background-color: white; padding: 15px 20px; margin: 0px auto; text-align: center; border-radius: 10px 10px 0 0;">
            <img src="../imagenes/Logo1.png" alt="fastsell logo" style="max-width: 50%; max-height: 67px;">
            <br><br>
            <table style="margin: 0px auto;">
                <tr>
                    <td style="padding: 10px;">  
                        <h2 style="color: rgb(14, 14, 93)">Hola ${name},</h2>
                        <p>Estás recibiendo este correo electrónico porque se ha solicitado un cambio de contraseña en su cuenta de Fastsell</p>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 10px;">
                        <p>Su nueva contraseña temporal es: <strong>${pass}</strong></p>
                    </td>
                </tr>
                <tr><td><br></td></tr>
                
                <tr><td><br></td></tr>
                <tr>
                    <td style="padding: 10px;">
                        <p>Al ingresar a su cuenta podra cambiar la contraseña por una nueva</p>
                    </td>
                </tr>
                <tr><td><br></td></tr>
                <tr>
                    <td style="padding: 10px; text-align: right;">
                        <b><p style="color: rgb(14, 14, 93)">-FASTSELL</p>
                        <p>Equipo de Soporte</p></b>
                    </td>
                </tr>
                <tr><td><br></td></tr>
            </table>
            
        </div>
        <div style="box-shadow: 0 24px 34px 6px rgba(0, 0, 0, 0.5); background-color: rgb(59, 56, 56); padding: 25px; text-align: center; border-radius: 0 0 10px 10px;">
            <a style="text-decoration: none; color: white;" >Fastsell</a> 
        </div> 
    </div>`
    return email;
};

module.exports = { mail };