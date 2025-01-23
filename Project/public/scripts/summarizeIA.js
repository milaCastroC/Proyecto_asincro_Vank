document.getElementById('form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const text = document.getElementById('text').value;
    const iaResponse = document.getElementById('iaResponse')
    

    try {
        const response = await fetch('/ia', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        });

        const data = await response.json();
        
        if (response.ok) {
            iaResponse.innerHTML = `
            <div class="card mb-4" id="iaResponse">
                <h5 class="card-header">RESUMEN</h5>
                <div class="card-body">
                    <h5 class="card-title">Texto resumido por ${data.summary.ia_model}</h5>
                    <p class="card-text">${data.summary.text}</p>
                </div>
            </div>
            `
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error creando archivo');
    }
});