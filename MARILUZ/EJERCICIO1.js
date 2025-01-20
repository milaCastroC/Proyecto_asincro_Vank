/**
 * Realizar una aplicación que genere miles de archivos de texto de la forma más
    rápida posible, de tal manera que se aproveche la asincronicidad.
 */

const fs = require('fs').promises;
const path = require('path');

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

createMultipleFiles("Hola, Vankversity!", 1000);
