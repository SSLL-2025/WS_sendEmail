const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config()


const sendEmail = async (req, res) => {

    try {
        // rescatamos json
        const mailOptions = req.body;

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "bodega.got@gmail.com",
                pass: process.env.PASS_GMAIL,

            },
        });

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.status(400).send('hubo un error al enviar correo' + error)
            } else {
                console.log('Email sent: ' + info.response);
                return res.status(200).send('Email enviado con exito')
            }
        });

    } catch (error) {
        res.status(400).send('hubo un error al enviar correo' + error)
    }



    
}


module.exports = {
    sendEmail
}