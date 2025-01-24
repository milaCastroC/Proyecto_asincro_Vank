document.getElementById('emailForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const sender = document.getElementById('sender').value;
    const subject = document.getElementById('subject').value;
    const content = document.getElementById('emailContent').value;
    const file = document.getElementById('excelFile').files[0];
    const alertMessage = document.getElementById("alertMessage");
    const btn = document.getElementById('sendEmails');
    const spinner = document.getElementById('spinner');
    const btnText = document.getElementById('button-text')

    btn.disabled = true;
    spinner.classList.remove('d-none');
    btnText.textContent = "Enviando...";


    const formData = new FormData();
    formData.append('sender', sender);
    formData.append('subject', subject);
    formData.append('content', content);
    formData.append('file', file); // Agregar el archivo al FormData

    try {
        const response = await fetch('/email', {
            method: 'POST',
            body: formData,
        });
        console.log('AQUI TOY');
        console.log(response.ok);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        if (response.ok) {
            alertMessage.classList.add('alert-success');
            alertMessage.classList.remove("d-none");
            alertMessage.textContent = "Correos envíados correctamente :D"
            setTimeout(() => {
                alertMessage.classList.add("d-none");
                alertMessage.classList.remove("alert-success");
            }, 5000);
            resetForm();
        } else {
            alertMessage.classList.add("alert-danger");
            alertMessage.classList.remove("d-none");
            alertMessage.textContent = "Error al enviar correos, por favor inténtelo de nuevo"
            setTimeout(() => {
                alertMessage.classList.add("d-none");
                alertMessage.classList.remove("alert-danger");
            }, 5000);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {

        alertMessage.classList.add("alert-danger");
        alertMessage.classList.remove("d-none");
        alertMessage.textContent = "Error al enviar correos, por favor inténtelo de nuevo"
        setTimeout(() => {
            alertMessage.classList.add("d-none");
            alertMessage.classList.remove("alert-danger");
        }, 5000);

        console.error('Error:', error);
    } finally {
        btn.disabled = false;
        spinner.classList.add('d-none');
        btnText.textContent = "Enviar Correos";
    }
    
});

function resetForm() {
    document.getElementById('sender').value = "";
    document.getElementById('subject').value = "";
    document.getElementById('emailContent').value = "";
    document.getElementById('excelFile').value = "";
}