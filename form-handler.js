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

        // Usar caminho relativo para a API
        const response = await fetch('/api/submitForm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({
                error: `Erro HTTP: ${response.status} ${response.statusText}`
            }));
            throw new Error(errorData.error || 'Erro ao enviar dados');
        }

        const result = await response.json();

        if (result.success) {
            window.location.href = '/obrigado.html';
        } else {
            throw new Error(result.error || 'Falha ao salvar os dados');
        }

    } catch (error) {
        console.error('Erro ao enviar as respostas:', error);
        showFlashMessage(
            `Erro ao enviar o formulário: ${error.message}. Por favor, tente novamente.`,
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
