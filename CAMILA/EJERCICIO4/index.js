// 4. Crear una app que envíe correo masivo de tal manera que permita enviar miles de correos al mismo tiempo. 
// Como sugerencia puede usar la librería de Nodejs llamada Nodemailer

const nodemailer = require('nodemailer');
const xlsx = require('xlsx'); //Para manejar archivos excel

// Configurar el transportador
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'emailsenderproject37@gmail.com',
        pass: 'kpja rdll fqst wwmp'
    }
});

function leerExcel(rutaArchivo){
    const workbook = xlsx.readFile(rutaArchivo); //Cargar archivo de excel
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
                <a href="#" style="color: #007bff; text-decoration: none;">URL del sitio cuando lo tengamos</a><br>
                Ten un buen día :D<br>
            </div>
        </div>
    </body>
    `
}

async function sendEmail(email, subject, htmlTemplate) {
    const mailOptions = {
        from: 'THE EMAIL MAN 👻 <emailsenderproject37@gmail.com>',
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

async function sendMassiveEmail(subject, content, emails) {
    const htmlTemplate = getHTMLTemplate(subject, content);
    let arregloPromesas = [];
    for (const email of emails) {
        arregloPromesas.push(sendEmail(email, subject, htmlTemplate));
    }        
    try {
        await Promise.all(arregloPromesas); // Espera todas las promesas
        console.log('Todos los correos fueron enviados.');
    } catch (error) {
        console.error('Hubo errores durante el envío masivo:', error.message);
    }
}

//Ruta del archivo excel, debe ir con \\ barras dobles
const archivoExcel = 'C:\\Users\\Usuario\\Downloads\\Emails.xlsx';


const emails = leerExcel(archivoExcel);

const subject = 'PRUEBA ENVÍO DE CORREO';
const content = `
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corporis sed, voluptas exercitationem blanditiis obcaecati quisquam quae, ad neque molestias architecto mollitia dolore, fugit in eveniet soluta repudiandae facere deserunt dignissimos?
                Aspernatur illo porro eius pariatur nostrum! Aliquid voluptas minus officiis molestias qui laboriosam assumenda suscipit tempore eius sint cupiditate, possimus tenetur labore, ex aspernatur eaque in a at fuga debitis!
                Perspiciatis velit vitae itaque est magni. Quaerat sequi dolor temporibus tenetur excepturi voluptatibus facilis quibusdam, est accusamus distinctio, modi vero libero officiis! Beatae culpa natus, eveniet in nulla voluptatum velit?
                Optio atque, doloremque laborum explicabo molestiae asperiores fugiat beatae itaque molestias quod porro, obcaecati alias repudiandae aperiam autem. Adipisci eos, distinctio aperiam in officia temporibus. Corrupti fugiat quis recusandae ipsa.
                Eum voluptatem tempore ea exercitationem doloremque corrupti maxime non ipsam sit praesentium natus reiciendis aperiam alias molestias quos numquam, sapiente recusandae repudiandae harum. Rerum error consequuntur quae natus voluptatum explicabo.
                `


sendMassiveEmail(subject, content, emails);

