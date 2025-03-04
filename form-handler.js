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
        // Enviar para Supabase
        supabaseSuccess = await submitToSupabase(data) || false;

    } catch (error) {
        console.warn('Erro ao enviar para Supabase:', error);
    }

    try {
        // Sempre tentar enviar para Google Apps Script
        const googleSuccess = await submitToGoogleScript(data) || false;

    } catch (googleError) {
        console.warn('Falha no envio para Google Sheets', googleError);
    }

    // Redirecionar para página de agradecimento se pelo menos um envio foi bem-sucedido
    if (supabaseSuccess || googleSuccess) {
        window.location.href = '/obrigado.html';
    } else {
        showFlashMessage('Nenhum envio foi bem-sucedido.', 'error');
    }
}


document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('myForm');
    form.addEventListener('submit', submitForm);
});

async function submitToGoogleScript(data) {
    // Mantenha sua implementação existente do Google Apps Script
    try {
        // Seu código existente para envio ao Google Sheets
        // ...
        return true;
    } catch (error) {
        console.error('Erro no envio para Google Sheets:', error);
        return false;
    }
}

// Exporte a função se necessário
window.submitToGoogleScript = submitToGoogleScript;
