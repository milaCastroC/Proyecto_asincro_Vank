const express = require('express');
const router = express.Router();

require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const HUGGING_API_KEY = process.env.HUGGING_API_KEY;
const COHERE_API_KEY = process.env.COHERE_API_KEY;


async function resumirHugging(texto) {
    const response = await fetch('https://api-inference.huggingface.co/models/facebook/bart-large-cnn', {
        method: 'POST',
        headers: {
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
        return { text: data[0].summary_text.trim(), ia_model: 'BART-LARGE-CNN (extraido de HUGGING FACE)' }
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
                parts: [{ text: `Resume el siguiente texto: \n\n${texto}` }],
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
            return { text: content.parts[0].text.trim(), ia_model: 'GEMINI' };
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
        return { text: generatedText, ia_model: 'COHERE' };
    } catch (error) {
        console.error('Error al llamar a la API de COHERE:', error);
        throw error;
    }
}

async function generarResumen(texto) {

    try {
        const response = await Promise.race([resumirGemini(texto), resumirHugging(texto), resumirCohere(texto)]);
        return response;
    } catch (error) {
        console.error('Error al generar resumen: ', error.message);
    }
}

router.post('/', async (req, res) => {
    try {
        const summary = await generarResumen(req.body.text);
        res.status(200).json({ summary: summary, message: 'Texto resumido con éxito' });
    } catch (error) {
        console.error('Error generando resumen:', error);
        res.status(500).json({ message: 'Error generando resumen:' });
    }
});

module.exports = router;