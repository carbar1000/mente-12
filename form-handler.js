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
        // Enviar para Supabase via API
        const response = await fetch('/api/submitForm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        supabaseSuccess = result.success;
    } catch (error) {
        console.warn('Erro ao enviar para Supabase:', error);
    }

    // Enviar para Google Sheet usando submit do próprio form
    try {
        await fetch(form.action, {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
        });
        
        // Se chegou até aqui, consideramos sucesso
        window.location.href = '/obrigado.html';
    } catch (error) {
        console.warn('Erro ao enviar para Google Sheets:', error);
        if (supabaseSuccess) {
            // Se pelo menos Supabase funcionou, redireciona
            window.location.href = '/obrigado.html';
        } else {
            showFlashMessage('Erro ao enviar o formulário. Por favor, tente novamente.', 'error');
        }
    }
}

// Adicione o event listener ao form
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('myForm');
    form.addEventListener('submit', submitForm);
window.submitToGoogleScript = submitToGoogleScript;
