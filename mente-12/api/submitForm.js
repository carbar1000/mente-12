const { createClient } = require('@supabase/supabase-js')

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  // Validar se temos as variáveis de ambiente
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Variáveis de ambiente do Supabase não configuradas');
    return res.status(500).json({ 
      success: false, 
      message: 'Erro de configuração do servidor' 
    });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const formData = req.body;
    
    // Log para debug
    console.log('Dados recebidos:', formData);

    if (!formData || Object.keys(formData).length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Dados do formulário não fornecidos' 
      });
    }

    const { data, error } = await supabase
      .from('respostas')
      .insert([formData]);

    if (error) {
      console.error('Erro Supabase:', error);
      throw error;
    }

    console.log('Dados salvos com sucesso:', data);

    res.status(200).json({ 
      success: true, 
      message: 'Dados salvos com sucesso'
    });

  } catch (error) {
    console.error('Erro detalhado:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao salvar dados',
      error: error.message 
    });
  }
}
