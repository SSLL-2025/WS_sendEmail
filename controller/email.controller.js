const nodemailer = require('nodemailer');
const dotenv = require('dotenv').config()
const { getAttachment } = require("../helpers/getAttachment");
const { emailCompra } = require('../helpers/emailHtml')


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

const sendEmailCompra = async (req, res) => {

    const request = req.body
  
    //Sacar el correo por el tipo de etiqueta.
    let correo = "bcort015@contratistas.codelco.cl";
    let nombre = "";
    let correosCopia = ['bcort015@contratistas.codelco.cl',
      'benjamin.cortes@psinet.cl',
      'rcami001@contratistas.codelco.cl',
      'mbust001@contratistas.codelco.cl',
      'jeade@codelco.cl',
      'apena020@contratistas.codelco.cl',
      "ggodo009@contratistas.codelco.cl",
      "marzule@contratistas.codelco.cl"];
    let nombre_compra = request.cardname;
    let link_tarjeta = request.link_card;
    let link_tablero = request.link_board;
    let detalle_tarjeta = request.detalle_card;
    let id_card = request.card_id;
  
    //REMPLAZANDO LOS ; DEL DETALLE TARJETA POR <BR> Y HAGA SALTO DE LINEA EN EL CORREO
    detalle_tarjeta = detalle_tarjeta.replaceAll(';', '<br><br>');
    detalle_tarjeta = detalle_tarjeta.replaceAll('**', '');
  
  
      if (request.etiqueta.includes("MS125")) {
        correosCopia.push('fmard004@contratistas.codelco.cl');
      }
  
    if (request.etiqueta.includes("RADIOS")) {
      correo = "apena020@contratistas.codelco.cl"
      nombre = "Alejandro Peñailillo"
    } else if (request.etiqueta.includes("NETWORKING")) {
      correo = "ocord001@contratistas.codelco.cl"
      nombre = "Oscar Cordero"
    } else if (request.etiqueta.includes("TELEFONIA")) {
      correo = "jbrit008@contratistas.codelco.cl"
      nombre = "Javier Brito"
    } else if (request.etiqueta.includes("TELECOMUNICACIONES")) {
      correo = ["ggodo009@contratistas.codelco.cl", "marzule@contratistas.codelco.cl"]
      nombre = "Guillermo / Marcelo"
    } else if (request.etiqueta.includes("TI")) {
      correo = "rcami001@contratistas.codelco.cl"
      nombre = "Rodrigo"
    } else if (request.etiqueta.includes("ENLACES")) {
       correo = "jbrit008@contratistas.codelco.cl"
      nombre = "Javier Brito"
    } else if (request.etiqueta.includes("CAMARAS")) {
      correo = "jbrit008@contratistas.codelco.cl"
     nombre = "Javier Brito"
   }  else {
      correo = "bcort015@contratistas.codelco.cl"
      nombre = ""
    }
  
    //SACAR LOS ADJUNTOS DE LA TARJETA TRELLO MEDIANTE LA API
    const adjuntos = await getAttachment(id_card);
  
  
  
    //BUSCAMOS EL EXCEL
    const excel = adjuntos.data.find(x => x.mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    const pdf = adjuntos.data.find(x => x.mimeType === 'application/pdf');
  
  
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "bodega.got@gmail.com",
        pass: "eubu dqiv heoy cipz",
  
      },
    });
  
    const mailOptions = {
      from: '"Compras GOT" <bodega.got@gmail.com>',
      to: correo,
      cc: correosCopia,
      subject: 'Compra ' + nombre_compra,
      text: 'Texto de correo',
      html: emailCompra(nombre, nombre_compra, link_tarjeta, link_tablero, detalle_tarjeta),
  
  
    };
  
    mailOptions.attachments = [
      {
        filename: 'header.png',
        path: './images/header.png',
        cid: 'unique@nodemailer.com' //same cid value as in the html img src
      }
    ];
  
    if (typeof excel !== 'undefined') {
      mailOptions.attachments.push({
        filename: excel.name,
        path: excel.url
      }); 
    }
  
    if (typeof pdf !== 'undefined') {
      mailOptions.attachments.push({
        filename: pdf.name,
        path: pdf.url
      }); 
    }
  
    
  
  
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  
  
    res.status(200).send('Correo enviado');
  }


module.exports = {
    sendEmail,
    sendEmailCompra
}