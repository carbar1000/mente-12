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
    // Configura CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Configura os headers de resposta
    res.setHeader('Content-Type', 'application/json');

    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false,
            error: 'Método não permitido',
            allowed: ['POST'] 
        });
    }

    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ 
                success: false,
                error: 'Dados do formulário inválidos' 
            });
        }

        const dadosComTimestamp = {
            ...req.body,
            created_at: new Date().toISOString()
        };
        
        const { data, error } = await supabase
            .from('respostas')
            .insert([dadosComTimestamp])
            .select();

        if (error) {
            console.error('Erro Supabase:', error);
            
            return res.status(500).json({ 
                success: false,
                error: 'Erro ao salvar dados',
                details: error.message
            });
        }

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

