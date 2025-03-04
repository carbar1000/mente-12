const { createClient } = require('@supabase/supabase-js')

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const formData = req.body;
    
    const { data, error } = await supabase
      .from('respostas')
      .insert([formData]);

    if (error) throw error;

    res.status(200).json({ 
      success: true, 
      message: 'Dados salvos com sucesso'
    });

  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao salvar dados' 
    });
  }
}
