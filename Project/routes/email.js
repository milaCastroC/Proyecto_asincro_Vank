require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const xlsx = require('xlsx'); //Para manejar archivos excel
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

// Configurar el transportador
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'emailsenderproject37@gmail.com',
        pass: process.env.EMAIL_PASS
    }
});

function leerExcel(archivo) {
    const buffer = archivo.buffer;
    const workbook = xlsx.read(buffer, {type: 'buffer'}); //Cargar archivo de excel
    const sheetName = workbook.SheetNames[0]; //Tomar la primera hoja
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet); //Convertir la hoja a JSON
    return data.map(row => row.Email); //La columna se debe llamar Email
}

function getHTMLTemplate(subject, content) {
    return `
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f9f9f9;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #e9f0ff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <img src="https://webycomunicacion.es/wp-content/uploads/2020/04/mail-2048128_1920-1024x927.png" alt="Logo" style="display: block; width: 150px; height: auto; margin: 40px auto;">
            <div style="padding: 32px; text-align: center;">
                <h1 style="font-size: 1.5rem; font-weight: 700; color: #333333; margin-bottom: 16px;">
                    ${subject}
                </h1>
                <p style="font-size: 1rem; color: #555555; line-height: 1.5; margin-bottom: 16px;">
                    ${content}
                </p>
            </div>
            <div style="text-align: center; font-size: 0.875rem; color: #6c757d; margin-top: 40px;">
                Enviado con <3 desde emailsenderproject37@gmail.com <br>
                Ten un buen día :D<br>
            </div>
        </div>
    </body>
    `
}

async function sendEmail(sender, email, subject, htmlTemplate) {
    const mailOptions = {
        from: `${sender} <emailsenderproject37@gmail.com>`,
        to: email,
        subject: subject,
        html: htmlTemplate
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Correo enviado a:', email, info.response);
    } catch (error) {
        console.error('Error al enviar correo a:', email, error);
    }
}

async function sendMassiveEmail(sender, subject, content, emails) {
    const htmlTemplate = getHTMLTemplate(subject, content);
    let arregloPromesas = [];
    console.log(emails);
    for (const email of emails) {
        arregloPromesas.push(sendEmail(sender, email, subject, htmlTemplate));
    }
    try {
        await Promise.all(arregloPromesas); // Espera todas las promesas
        console.log('Todos los correos fueron enviados.');
    } catch (error) {
        console.error('Hubo errores durante el envío masivo:', error.message);
    }
}


// Peticion para leer excel
router.post('/', upload.single('file'), async (req, res) => {
    try {
        let emails;
        if (req.file) {
            emails = leerExcel(req.file); // Pasar el archivo cargado
        } else {
            emails = req.body.emails; // Usar la lista de correos del cuerpo de la solicitud
        }
        await sendMassiveEmail(req.body.sender, req.body.subject, req.body.content, emails);

        res.status(200).json({ message: 'Mensaje enviado con éxito' });
    } catch (error) {
        console.error('Error creando archivos:', error);
        res.status(500).json({ message: 'Error al enviar correos' });
    }
});

module.exports = router;

