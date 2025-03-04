const { createClient } = require('@supabase/supabase-js')

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false, 
            message: 'Método não permitido' 
        });
    }

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error('Variáveis de ambiente do Supabase não configuradas');
        return res.status(500).json({ 
            success: false, 
            message: 'Erro de configuração do servidor' 
        });
    }

    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
            auth: { autoRefreshToken: false, persistSession: false }
        }
    );

    try {
        const formData = req.body;
        
        if (!formData || Object.keys(formData).length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Dados do formulário não fornecidos' 
            });
        }

        const { data, error } = await supabase
            .from('respostas')
            .insert([formData])
            .select();

        if (error) {
            console.error('Erro Supabase:', error);
            return res.status(500).json({ 
                success: false, 
                message: 'Erro ao inserir dados',
                error: error.message 
            });
        }

        return res.status(200).json({ 
            success: true, 
            message: 'Dados salvos com sucesso',
            data: data
        });

    } catch (error) {
        console.error('Erro:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Erro ao processar requisição',
            error: error.message 
        });
    }
}
