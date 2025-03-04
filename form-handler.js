document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('myForm');
    if (form) {

    form.removeEventListener('submit', handleSubmit);
    form.addEventListener('submit', handleSubmit);

        form.addEventListener('submit', handleSubmit);
    }
});

function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const dados = {};
    formData.forEach((value, key) => {
        dados[key] = value;
    });
    enviarRespostas(dados);
}

async function enviarRespostas(dados) {
    try {
        const response = await fetch('/api/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados),
        });

        if (response.ok) {
            window.location.href = 'obrigado.html';
        } else {
            console.error('Erro ao enviar as respostas:', response.statusText);
        }
    } catch (error) {
        console.error('Erro ao enviar as respostas:', error);
    }
}
