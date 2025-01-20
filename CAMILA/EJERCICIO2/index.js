require('dotenv').config();
const readLine = require( 'readline/promises'); 

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const HUGGING_API_KEY = process.env.HUGGING_API_KEY;
const COHERE_API_KEY = process.env.COHERE_API_KEY;


async function resumirHugging(texto) {
    const response = await fetch('https://api-inference.huggingface.co/models/t5-base', {
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
        return data[0].summary_text.trim();
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
            console.log(content.parts[0].text.trim()); 
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
                prompt: `Resume el siguiente texto y responde siempre en español:  ${texto}`,
                max_tokens: 200,
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        const generatedText = data.generations[0].text || 'Texto no disponible'; // Estructura esperada
        return generatedText;
    } catch (error) {
        console.error('Error al llamar a la API de COHERE:', error);
        throw error;
    }
}


// async function resumirOpenIa(texto) {
//     const response = await fetch('https://api.openai.com/v1/completions',{
//         method: 'POST',
//         headers: {
//             'Authorization' : `Bearer ${OPENAI_API_KEY}`,
//             'Content-type': 'application/json',
//         },
//         body: JSON.stringify({
//             model: 'gpt-3.5-turbo',
//             prompt: `Resume el siguiente texto: \n\n${texto}`,
//             // max_tokens: 100,
//         }),
//     });

//     if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Error en OpenAI API: ${response.status} - ${errorText}`);
//     }

//     const data = await response.json();
//     if (data.choices && data.choices.length > 0) {
//         return data.choices[0].text.trim();
//     } else {
//         throw new Error('La respuesta de OpenAI no contiene "choices".');
//     }
// }

// resumirOpenIa("La inteligencia artificial (IA) se refiere a la simulación de procesos de inteligencia humana por parte de sistemas informáticos. Estos procesos incluyen el aprendizaje, el razonamiento y la autocorrección. En la actualidad, la IA está presente en diversas aplicaciones, como asistentes virtuales, vehículos autónomos, diagnóstico médico, y análisis de datos. Su desarrollo ha generado debates sobre su impacto en el empleo, la privacidad y la ética, lo que subraya la importancia de establecer marcos regulatorios adecuados para su implementación responsable.");


async function generarResumen(texto) {

    try {
        const resumen = await Promise.race([resumirGemini(texto),resumirHugging(texto),resumirCohere(texto),]);
        console.log('Resumen generado: ', resumen);
    } catch (error) {
        console.error('Error al generar resumen: ', error.message);
    }
}


generarResumen("La inteligencia artificial (IA) se refiere a la simulación de procesos de inteligencia humana por parte de sistemas informáticos. Estos procesos incluyen el aprendizaje, el razonamiento y la autocorrección. En la actualidad, la IA está presente en diversas aplicaciones, como asistentes virtuales, vehículos autónomos, diagnóstico médico, y análisis de datos. Su desarrollo ha generado debates sobre su impacto en el empleo, la privacidad y la ética, lo que subraya la importancia de establecer marcos regulatorios adecuados para su implementación responsable.");
