document.getElementById('form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const filesAmount = document.getElementById('filesAmount').value;
    const content = document.getElementById('fileContent').value;

    try {
        const response = await fetch('/files', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filesAmount, content }),
        });

        
        if (response.ok) {
            const alertMessage = document.getElementById("alertMessage");
            alertMessage.classList.remove("d-none");
            document.getElementById('fileContent').value = "";

            setTimeout(() => {
                alertMessage.classList.add("d-none");
            }, 5000);
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error creando archivo');
    }
});