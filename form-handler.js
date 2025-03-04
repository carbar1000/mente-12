document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('myForm');
    if (form) {
        form.removeEventListener('submit', handleSubmit);
        form.addEventListener('submit', handleSubmit);
    }
});

async function handleSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    
    if (!validateForm()) {
        return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = true;
    }

    try {
        const formData = new FormData(form);
        const dados = Object.fromEntries(formData.entries());

        showFlashMessage('Enviando formulário...', 'info');

        const response = await fetch('/api/submitForm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        const result = await response.json();

        if (!response.ok) {
            // Extrai a mensagem de erro da resposta
            const errorMessage = result.error || result.details || 'Erro desconhecido';
            throw new Error(errorMessage);
        }

        if (result.success) {
            window.location.href = '/obrigado.html';
        } else {
            throw new Error(result.error || 'Falha ao salvar os dados');
        }

    } catch (error) {
        console.error('Erro ao enviar as respostas:', error);
        
        // Determina a mensagem de erro apropriada
        let errorMessage;
        if (error.message && error.message !== '[object Object]') {
            errorMessage = error.message;
        } else if (error.error) {
            errorMessage = error.error;
        } else if (error.details) {
            errorMessage = error.details;
        } else {
            errorMessage = 'Ocorreu um erro ao enviar o formulário';
        }

        showFlashMessage(
            `Erro ao enviar o formulário: ${errorMessage}. Por favor, tente novamente.`,
            'error'
        );
    } finally {
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
