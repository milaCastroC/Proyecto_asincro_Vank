// 1. Realizar una aplicación que genere miles de archivos de texto de la forma más rápida posible, 
// de tal manera que se aproveche la asincronicidad.

const fs = require( 'fs' ).promises; //Para trabajar de forma asincrónica con el sistema de archivos
const readLine = require( 'readline/promises'); //Para obtener y sacar datos por consola

//Función que crea el archivo de texto
async function crearArchivo(nombre, contenido) {
    return fs.writeFile(`${nombre}.txt`, contenido) //Escribe el contenido en un archivo con el nombre dado
    .then(() => `Archivo ${nombre}.txt creado`) // Retorna un mensaje indicando que el archivo fue creado.
    .catch((error) => { // Maneja errores durante la creación del archivo.
        console.log(`Error al crear el archivo ${nombre}.txt: `, error); //Imprime los errores durante la creación de los archivos
    });
}

//Función que coordina la lógica, se encarga de obtener los datos(numero de archivos y contenido de los archivos) y genera los archivos de texto de forma asincrónica
async function main() {
     // Crear una interfaz de readline para manejar entrada/salida por consola.
    const rl = readLine.createInterface({
        input: process.stdin, //Especifica la fuente de entrada y representa la entrada por teclado
        output: process.stdout, //Especifica la fuente de saluda y representa la salida por consola
    })

    try{
        //Solicita al usuario la cantidad de archivos que desea crear
        const numArchivos = parseInt(await rl.question("Ingrese la cantidad de archivos que desea generar: "));
        //Solicita al usuario el contenido de los archivos
        const contenido = await rl.question("Ingrese el contenido de su archivo: ");
        rl.close(); //Cerrar la interfaz de readline

        //Validar que el número de archivos sea mayor a 0
        if(numArchivos <= 0){
            console.log("Por favor ingrese un número válido");
            return; //Retorna si el número no es válido
        }

        let arregloPromesas = []; //Arreglo de promesas para almacenar los archivos creados

        //Generar las promesas para crear el número de archivos especificados
        for(let i = 1; i <= numArchivos; i++){
            arregloPromesas.push(crearArchivo(String(i), contenido)); //Crea el archivo y lo añade al arreglo de promesas
        }

        //Creacion de todos los archivos y maneja los casos exitosos
        Promise.all(arregloPromesas).then((resultados) => {
            console.log("Se han creado todos los archivos"); //Mostrar el mensaje de exito si los archivos se crearon
            console.log(resultados);
        }).catch((error => { //Manejo de errores si alguna promesa falla
            console.log("Error en la creación de los archivos: ", error); //Mostrar el mensaje de error
        }));

    }catch(error){
        //Muestra cualquier error en caso de que falle el bloqye try
        console.log("Error durante la ejecución: ", error);
    }
}

//Llama la función principal
main();