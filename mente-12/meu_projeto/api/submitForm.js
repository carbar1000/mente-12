import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

// Funções de utilitário mantidas
function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  return input
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function generateCSRFToken() {
  return crypto.randomBytes(32).toString('hex');
}

export default async function handler(req, res) {
  // Configurações de segurança
  if (req.method !== 'POST') {
    console.warn(`Método não permitido: ${req.method}`);
    return res.status(405).json({ 
      error: 'Método não permitido',
      message: 'Apenas requisições POST são aceitas.'
    });
  }

  // Credenciais seguras via variáveis de ambiente
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_ANON_KEY

  try {
    // Validar dados recebidos
    const formData = req.body
    if (!formData || Object.keys(formData).length === 0) {
      console.warn('Dados do formulário inválidos ou vazios');
      return res.status(400).json({ 
        error: 'Dados inválidos',
        message: 'Nenhum dado foi recebido no formulário.'
      });
    }

    // Sanitizar e validar dados
    const sanitizedData = {
      nome: sanitizeInput(formData.Nome),
      email: sanitizeInput(formData.Email),
      cor: sanitizeInput(formData.A),
      animal: sanitizeInput(formData.B),
      hobby: sanitizeInput(formData.C)
    }

    // Validação adicional de email
    if (!validateEmail(sanitizedData.email)) {
      console.warn(`Email inválido: ${sanitizedData.email}`);
      return res.status(400).json({ 
        error: 'Email inválido',
        message: 'O formato do email não é válido.'
      });
    }

    // Preparar dados para envio
    const dataToSend = {
      ...sanitizedData,
      timestamp: new Date().toISOString(),
      csrf_token: generateCSRFToken()
    }

    // Logs de auditoria
    console.info('Dados recebidos para processamento:', {
      timestamp: dataToSend.timestamp,
      email: dataToSend.email.replace(/(.{2}).+/, '$1***@')
    });

    // Envio para Supabase
    const supabase = createClient(supabaseUrl, supabaseKey)
    const { error: supabaseError } = await supabase
      .from('respostas')
      .insert([dataToSend])

    if (supabaseError) {
      console.error('Erro no Supabase:', supabaseError);
      throw supabaseError;
    }

    // Resposta de sucesso
    console.info('Dados processados com sucesso no Supabase');

    res.status(200).json({ 
      message: 'Dados salvos com sucesso', 
      redirectUrl: '/obrigado.html',
      csrf_token: dataToSend.csrf_token
    });

  } catch (error) {
    // Tratamento centralizado de erros
    console.error('Erro crítico no processamento:', {
      message: error.message,
      stack: error.stack
    });

    res.status(500).json({ 
      error: 'Erro no processamento',
      message: 'Não foi possível processar o formulário. Tente novamente mais tarde.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
