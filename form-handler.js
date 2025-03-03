// Função para manipular o envio do formulário
async function submitForm(event) {
    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    const form = document.getElementById('myForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        // Enviar para Supabase
        const supabaseResult = await submitToSupabase(data);

        // Redirecionar para página de agradecimento
        window.location.href = '/obrigado.html';
    } catch (error) {
        showFlashMessage(error.message, 'error');
    }
}

// Adicionar event listener
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('myForm');
    form.addEventListener('submit', submitForm);
});
