async function submitForm(event) {
    event.preventDefault();
    console.log('Iniciando submissão do formulário');

    if (!validateForm()) {
        console.log('Validação falhou');
        return;
    }

    // Desabilitar o botão de submit para evitar envios duplicados
    const submitButton = event.submitter;
    if (submitButton) {
        submitButton.disabled = true;
    }

    // Preparar os dados
    const form = document.getElementById('myForm');
    const formData = new FormData(form);
    const timestamp = new Date().toISOString();
    formData.append('timestamp', timestamp);
    
    // Criar objeto para Supabase
    const supabaseData = Object.fromEntries(formData.entries());
    console.log('Dados preparados:', supabaseData);

    let supabaseSuccess = false;
    let sheetsSuccess = false;

    try {
        // 1. Primeiro envio: Supabase
        console.log('Iniciando envio para Supabase...');
        const supabaseResponse = await fetch('/api/submitForm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(supabaseData)
        });

        const supabaseResult = await supabaseResponse.json();
        console.log('Resposta Supabase:', supabaseResult);

        if (supabaseResponse.ok && supabaseResult.success) {
            supabaseSuccess = true;
            console.log('Envio para Supabase bem-sucedido');
        } else {
            console.warn('Falha no envio para Supabase:', supabaseResult.message);
        }

    } catch (error) {
        console.error('Erro no envio para Supabase:', error);
    }

    try {
        // 2. Segundo envio: Google Sheets
        console.log('Iniciando envio para Google Sheets...');
        const sheetsResponse = await fetch(form.action, {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
        });

        // Devido ao mode: 'no-cors', assumimos sucesso se não houver erro
        sheetsSuccess = true;
        console.log('Envio para Google Sheets completado');

    } catch (error) {
        console.error('Erro no envio para Google Sheets:', error);
    }

    // Reabilitar o botão de submit
    if (submitButton) {
        submitButton.disabled = false;
    }

    // Decidir próxima ação com base nos resultados
    if (supabaseSuccess || sheetsSuccess) {
        // Se pelo menos um dos envios foi bem-sucedido
        console.log('Pelo menos um envio bem-sucedido. Redirecionando...');
        window.location.href = '/obrigado.html';
    } else {
        // Se ambos falharam
        console.error('Falha em ambos os envios');
        showFlashMessage(
            'Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.',
            'error'
        );
    }
}

// Função melhorada para exibir mensagens
function showFlashMessage(message, type) {
    const flashMessageDiv = document.getElementById('flashMessage');
    if (!flashMessageDiv) return;

    flashMessageDiv.textContent = message;
    flashMessageDiv.className = `flash-message ${type}`;
    flashMessageDiv.style.display = 'block';
    
    // Posicionamento e estilo
    flashMessageDiv.style.position = 'fixed';
    flashMessageDiv.style.top = '20px';
    flashMessageDiv.style.left = '50%';
    flashMessageDiv.style.transform = 'translateX(-50%)';
    flashMessageDiv.style.zIndex = '1000';
    
    setTimeout(() => {
        flashMessageDiv.style.display = 'none';
    }, type === 'error' ? 5000 : 3000);
}

// Garantir que só há um listener de evento
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('myForm');
    if (form) {
        // Remover listeners anteriores
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);
        
        // Adicionar novo listener
        newForm.addEventListener('submit', submitForm);
    }
}
