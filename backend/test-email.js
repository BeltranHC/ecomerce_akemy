
require('dotenv').config();
const nodemailer = require('nodemailer');

async function main() {
    console.log('1. Cargando configuración...');
    const config = {
        host: process.env.SMTP_HOST || process.env.MAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || process.env.MAIL_PORT || '587'),
        user: process.env.SMTP_USER || process.env.MAIL_USER,
        pass: process.env.SMTP_PASS || process.env.MAIL_PASS,
    };

    console.log('Configuración detectada (sin contraseña):', {
        ...config,
        pass: config.pass ? '********' : 'FALTA',
    });

    if (!config.user || !config.pass) {
        console.error('❌ ERROR: Faltan credenciales en el archivo .env');
        return;
    }

    console.log('2. Creando transportador...');
    const transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: false, // true for 465, false for other ports
        auth: {
            user: config.user,
            pass: config.pass,
        },
    });

    console.log('3. Verificando conexión SMTP...');
    try {
        await transporter.verify();
        console.log('✅ Conexión SMTP EXITOSA.');
    } catch (error) {
        console.error('❌ ERROR al conectar con SMTP:', error.message);
        if (error.code === 'EAUTH') {
            console.error('   -> Probablemente usuario o contraseña incorrectos.');
            console.error('   -> Si usas Gmail, asegúrate de usar una "Contraseña de Aplicación".');
        }
        return;
    }

    console.log('4. Intentando enviar correo de prueba...');
    try {
        const info = await transporter.sendMail({
            from: `"Test Script" <${config.user}>`,
            to: config.user, // Enviar al mismo usuario
            subject: "Test de Correo Akemy",
            text: "Si lees esto, el envío de correos funciona correctamente.",
        });
        console.log('✅ Correo enviado EXITOSAMENTE!');
        console.log('ID del mensaje:', info.messageId);
        console.log('Respuesta del servidor:', info.response);
    } catch (error) {
        console.error('❌ ERROR al enviar correo:', error.message);
    }
}

main().catch(console.error);
