document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('myForm');
    if (form) {
        form.removeEventListener('submit', handleSubmit);
        form.addEventListener('submit', handleSubmit);
    }
});

async function handleSubmit(event) {
    event.preventDefault();
    
    if (!validateForm()) {
        return;
    }

    try {
        const form = event.target;
        const formData = new FormData(form);
        const dados = Object.fromEntries(formData.entries());

        // Desabilita o botão de envio
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
        }

        // Mostra mensagem de carregamento
        showFlashMessage('Enviando formulário...', 'info');

        const response = await fetch('/api/submitForm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        // Primeiro verifica se a resposta é JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Resposta do servidor não é JSON válido');
        }

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Erro ao enviar dados');
        }

        if (result.success) {
            window.location.href = '/obrigado.html';
        } else {
            throw new Error('Falha ao salvar os dados');
        }

    } catch (error) {
        console.error('Erro ao enviar as respostas:', error);
        showFlashMessage('Erro ao enviar o formulário. Por favor, tente novamente.', 'error');
    } finally {
        // Reabilita o botão de envio
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = false;
        }
    }
}

function showFlashMessage(message, type) {
    const flashMessageDiv = document.getElementById('flashMessage');
    if (flashMessageDiv) {
        flashMessageDiv.textContent = message;
        flashMessageDiv.className = `flash-message ${type}`;
        flashMessageDiv.classList.remove('hidden');
        setTimeout(() => {
            flashMessageDiv.classList.add('hidden');
        }, 3000);
    }
}
