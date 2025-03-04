document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('myForm');
    if (form) {
        form.removeEventListener('submit', handleSubmit);
        form.addEventListener('submit', handleSubmit);
    }
});

async function handleSubmit(event) {
    event.preventDefault();
    
    // Armazena a referência do formulário no início da função
    const form = event.target;
    
    if (!validateForm()) {
        return;
    }

    // Obtém o botão de envio no início
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = true;
    }

    try {
        const formData = new FormData(form);
        const dados = Object.fromEntries(formData.entries());

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
        // Reabilita o botão de envio usando a referência do formulário armazenada
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
