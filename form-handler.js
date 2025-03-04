async function submitForm(event) {
    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    const form = document.getElementById('myForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    let supabaseSuccess = false;

    try {
        // Log para debug
        console.log('Enviando dados:', data);

        const response = await fetch('/api/submitForm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        console.log('Resposta da API:', result);

        if (!response.ok) {
            throw new Error(result.message || 'Erro ao enviar para Supabase');
        }

        supabaseSuccess = result.success;

        // Enviar para Google Sheets
        await fetch(form.action, {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
        });
        
        // Se chegou até aqui, redireciona
        window.location.href = '/obrigado.html';
    } catch (error) {
        console.error('Erro detalhado:', error);
        if (!supabaseSuccess) {
            showFlashMessage('Erro ao enviar o formulário. Por favor, tente novamente.', 'error');
        }
    }
}

// Remover qualquer outro event listener duplicado
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('myForm');
    if (form) {
        // Remover listeners anteriores
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);
        newForm.addEventListener('submit', submitForm);
    }
window.submitToGoogleScript = submitToGoogleScript;
