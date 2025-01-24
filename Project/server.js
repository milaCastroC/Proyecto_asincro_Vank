//server
const express = require('express');
const path = require('path');

// Crear la aplicación de Express
const app = express();
const PORT = 3000;

// Middleware para analizar JSON y datos del formulario
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Servir contenido estático
app.use(express.static(path.join(__dirname, 'public')));

// Rutas frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'home.html'));
});

app.get('/create-file', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'fileCreator.html'));
});

app.get('/summarize-with-IA', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'summarizeIA.html'));
});

app.get('/weather', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'weather.html'));
});

app.get('/email-sender', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'emailSender.html'));
});


// Rutas backend
const fileRoutes = require('./routes/files');
app.use('/files', fileRoutes);

const iaRoutes = require('./routes/ia');
app.use('/ia', iaRoutes)

const emailRoutes = require('./routes/email')
app.use('/email', emailRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
