// 2. Crear una aplicación que genere resúmenes de contenido de texto mediante un LLM (IA), de tal forma que estos resúmenes se 
// obtengan de la IA lo más rápido posible haciendo de esta manera que la app sea eficiente.require('dotenv').config();
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const HUGGING_API_KEY = process.env.HUGGING_API_KEY;
const COHERE_API_KEY = process.env.COHERE_API_KEY;


async function resumirHugging(texto) {
    const response = await fetch('https://api-inference.huggingface.co/models/facebook/bart-large-cnn', {
        method: 'POST',
        headers:{
            'Authorization': `Bearer ${HUGGING_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputs: `Resume el siguiente texto: ${texto}` })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error en Hugging Face API: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    if (Array.isArray(data) && data.length > 0 && data[0].summary_text) {
        return {text: data[0].summary_text.trim(), ia_model: 'BART-LARGE-CNN (extraido de HUGGING FACE)'} 
    } else {
        throw new Error('La respuesta de Hugging Face no contiene "summary_text".');
    }
}

const API_AI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

async function resumirGemini(texto) {
    const response = await fetch(`${API_AI_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: `Resume el siguiente texto: \n\n${texto}`}],
            }],
        }),
    });
     if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error en Gemini API: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (data.candidates && data.candidates.length > 0) {
        const content = data.candidates[0].content;

        if (content && content.parts && content.parts.length > 0) {
            return { text: content.parts[0].text.trim(), ia_model: 'GEMINI'}; 
        } else {
            throw new Error('No se encontró contenido en "parts".');
        }
    } else {
        throw new Error('La respuesta de Gemini no contiene "candidates".');
    } 
}

async function resumirCohere(texto) {
    try {
        const response = await fetch('https://api.cohere.ai/v1/generate', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${COHERE_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: `Summarize in Spanish the next text:   ${texto}`,
                max_tokens: 200,
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        const generatedText = `COHERE: ` + data.generations[0].text || 'Texto no disponible'; // Estructura esperada
        return {text: generatedText, ia_model: 'COHERE'};
    } catch (error) {
        console.error('Error al llamar a la API de COHERE:', error);
        throw error;
    }
}

async function generarResumen(texto) {

    try {
        const response = await Promise.race([resumirGemini(texto), resumirHugging(texto), resumirCohere(texto)]);
        console.log(`\n ***** EL GANADOR ES: ${response.ia_model}***** \n`);
        console.log(`RESUMEN: ${response.text}`);

        return response;
    } catch (error) {
        console.error('Error al generar resumen: ', error.message);
    }
}

//generarResumen("La inteligencia artificial se refiere a la simulación de procesos de inteligencia humana por parte de sistemas informáticos. Estos procesos incluyen el aprendizaje, el razonamiento y la autocorrección. En la actualidad, la IA está presente en diversas aplicaciones, como asistentes virtuales, vehículos autónomos, diagnóstico médico, y análisis de datos. Su desarrollo ha generado debates sobre su impacto en el empleo, la privacidad y la ética, lo que subraya la importancia de establecer marcos regulatorios adecuados para su implementación responsable.");

generarResumen(`
    Jaimito, el cartero, cuyo nombre secular es Jaime Garabito, es un personaje de la serie de televisión El Chavo del Ocho, interpretado por Raúl «Chato» Padilla (quien falleció en 1994).
    Hizo su primera aparición en 1979 junto a Doña Nieves, tras la ausencia de Quico y Don Ramón, convirtiéndose en un personaje permanente hasta el fin del programa en 1980 y durante su continuación en 1982 para numerosos episodios en el programa Chespirito hasta su definitivo final en 1992.
    Apariencia: Tiene cabello blanco, largo y descuidado, ya que se le ve con la gorra puesta.
    Tiene un bigote también blanco con el cual resalta sus muecas y gesticulaciones.
    Usa lentes pequeños y redondos, con un traje azul grisáceo de cartero, un bolso en el que lleva las cartas y un pañuelo en el cuello, con botas negras, un gorro negro y un cinturón.
    En un episodio de la versión animada se mostró con un pijama con sobres.
`)

// generarResumen(`
//     La vaquita marina o cochito (Phocoena sinus) es una especie de cetáceo odontoceto de la familia Phocoenidae, una de las siete especies de marsopa.
//     Mide 150 cm de largo y pesa hasta 50 kg. Tiene una distribución muy restringida. También es considerada una especie endémica de México en Baja California.
//     Sus poblaciones han disminuido durante las pasadas décadas al punto de ser considerada en grave peligro de extinción. En el 2015, la población total era de noventa y siete individuos.
//     En 2017 perdió el 67% de su población, quedando con menos de cuarenta individuos. A finales de 2018 y principios de 2019, se estimaba la existencia de entre diez y quince. Según WWF, se está extinguiendo.
//     Se han puesto en marcha medidas de conservación, pero la especie se considera en peligro inminente de extinción.
//     El 18 de octubre de 2017 fue rescatada una vaquita marina de seis meses de edad; sin embargo, fue devuelta al mar por recomendación de los veterinarios expertos, quienes consideraron que la cría no podía estar separada de su madre.
//     El 10 de noviembre de ese mismo año, científicos del Programa VaquitaCPR dieron a conocer resultados de operaciones en campo. Reportaron el avistamiento de individuos en ocho de trece días de labor en el mar. Registraron treinta y dos avistamientos, incluyendo probables individuos repetidos en el curso de un día.
//     Es importante aclarar que estos avistamientos no representan un estimado de la población de vaquitas. Los eventos de avistamientos incluyeron de una a tres vaquitas a la vez, con promedio de dos vaquitas por grupo.
//     En marzo de 2018, la situación se ha vuelto crítica y, según Andrea Crosta, de la organización protectora de animales Elephant Action League, solamente se han podido detectar doce individuos nadando en el golfo de California, junto a la península de Baja California.

// `)


