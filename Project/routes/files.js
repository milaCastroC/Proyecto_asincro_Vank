const fs = require('fs').promises;
const express = require('express');
const path = require('path');

const router = express.Router();

async function createFile(nombre, contenido) {
    const folderPath = path.join(__dirname, 'files'); // Ruta de la carpeta 'files'
    const filePath = path.join(folderPath, `${nombre}.txt`); // Ruta completa del archivo

    try {
        await fs.mkdir(folderPath, { recursive: true }); // Crear la carpeta 'files' si no existe
        await fs.writeFile(filePath, contenido);
        return `Archivo ${nombre}.txt creado en la carpeta 'files'`;
    } catch (error) {
        console.error(`Error al crear ${nombre}.txt:`, error);
    }
}

async function createMultipleFiles(contenido, amount) {
    let arregloPromesas = [];

    for (let index = 1; index <= amount; index++) {
        arregloPromesas.push(createFile(String(index), contenido));
    }

    Promise.all(arregloPromesas).then((results) => {
        results.forEach((result) => console.log(result));
    });
}

router.post('/', async (req, res) => {
    try {
      await createMultipleFiles(req.body.content, req.body.filesAmount);
  
      res.status(200).json({ message: 'Archivos creados con éxito' });
    } catch (error) {
      console.error('Error creando archivos:', error);
      res.status(500).json({ message: 'Error creando archivos' });
    }
  });
  
module.exports = router;
