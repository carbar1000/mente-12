document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('myForm');
    if (form) {
        // Remove o listener duplicado
        form.removeEventListener('submit', handleSubmit);
        form.addEventListener('submit', handleSubmit);
    }
});

async function handleSubmit(event) {
    event.preventDefault();
    
    if (!validateForm()) {
        return;
    }

    const form = event.target;
    const formData = new FormData(form);
    const dados = Object.fromEntries(formData.entries());

    try {
        // Enviar para Supabase via API
        const response = await fetch('/api/submitForm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro ao enviar dados');
        }

        const result = await response.json();
        
        if (result.success) {
            // Redirecionar para página de agradecimento
            window.location.href = '/obrigado.html';
        } else {
            showFlashMessage('Erro ao enviar o formulário. Por favor, tente novamente.', 'error');
        }

    } catch (error) {
        console.error('Erro ao enviar as respostas:', error);
        showFlashMessage('Erro ao enviar o formulário. Por favor, tente novamente.', 'error');
    }
}

async function enviarRespostas(dados) {
    try {
        const response = await fetch('/api/submitForm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados),
        });

        if (!response.ok) {
            throw new Error('Erro ao enviar dados');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao enviar as respostas:', error);
        throw error;
    }
}
