import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL e/ou chave anônima não configuradas');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false
    }
});

export default async function handler(req, res) {
    // Configura os headers de resposta
    res.setHeader('Content-Type', 'application/json');

    // Verifica o método HTTP
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false,
            error: 'Método não permitido',
            allowed: ['POST'] 
        });
    }

    try {
        // Validação básica dos dados
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ 
                success: false,
                error: 'Dados do formulário inválidos' 
            });
        }

        // Log dos dados recebidos
        console.log('Dados recebidos:', req.body);

        // Adiciona timestamp aos dados
        const dadosComTimestamp = {
            ...req.body,
            created_at: new Date().toISOString()
        };
        
        // Inserir dados na tabela respostas
        const { data, error } = await supabase
            .from('respostas')
            .insert([dadosComTimestamp])
            .select();

        if (error) {
            console.error('Erro Supabase:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            });
            
            return res.status(500).json({ 
                success: false,
                error: 'Erro ao salvar dados',
                details: error.message,
                code: error.code
            });
        }

        console.log('Dados salvos com sucesso:', data);
        
        return res.status(200).json({
            success: true,
            data: data
        });

    } catch (error) {
        console.error('Erro ao processar requisição:', error);
        return res.status(500).json({ 
            success: false,
            error: 'Erro interno do servidor',
            details: error.message 
        });
    }
}

