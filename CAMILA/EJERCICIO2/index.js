require('dotenv').config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const HUGGING_API_KEY = process.env.HUGGING_API_KEY;


async function testAPIKeyOpenIA() {

    try{
        const response = await fetch('https://api.openai.com/v1/models', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if(response.ok){
            const data = await response.json();
            console.log('Conexión exitosa: ', data);
        }else{
            console.error('Error: ', response.status, await response.text());
        }
    }catch(error){
        console.log("Error al conectar con OpenAI: ", error);
    }
}

testAPIKeyOpenIA();

const API_AI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

async function testAPIKeyGemini() {
    try {
        const response = await fetch(`${API_AI_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "contents": [{
                    "parts":[{"text": "Write a story about a magic backpack."}]
                 }],
            }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Conexión exitosa:',  data);
        } else {
            console.error('Error:', response.status, await response.text());
        }
    } catch (error) {
        console.error('Error al conectar con Gemini:', error);
    }
}

testAPIKeyGemini();

async function testAPIKeyHugging() {

    try{
        const response = await fetch('https://api-inference.huggingface.co/models/facebook/bart-large-cnn', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${HUGGING_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if(response.ok){
            const data = await response.json();
            console.log('Conexión exitosa: ', data);
        }else{
            console.error('Error: ', response.status, await response.text());
        }
    }catch(error){
        console.log("Error al conectar con OpenAI: ", error);
    }
}

testAPIKeyHugging();