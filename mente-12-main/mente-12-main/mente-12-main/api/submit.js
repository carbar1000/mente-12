const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const router = express.Router();

// Supabase configuration (using environment variables from Vercel)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

router.post('/submit', async (req, res) => {
    const dados = req.body;

    console.log('Dados recebidos:', dados);

    // Validação básica dos dados recebidos
    if (!dados || typeof dados !== 'object') {
        return res.status(400).json({ success: false, message: 'Dados inválidos!' });
    }


    try {
        // Insert data into Supabase (using the correct table name: "respostas")
        console.log('Dados a serem inseridos no Supabase:', dados);
        const { data, error } = await supabase
            .from('respostas') // Correct table name
            .insert([dados])
            .select();

        if (error) {
        console.error('Erro ao inserir dados no Supabase:', error.message, error.stack);

            return res.status(500).json({ success: false, message: 'Erro ao enviar dados para o Supabase!' });
        }

        console.log('Dados inseridos com sucesso:', data);

        res.json({ success: true, message: 'Dados recebidos e enviados para o Supabase com sucesso!' });

    } catch (error) {
        console.error('Erro no processo de envio de dados:', error);
        res.status(500).json({ success: false, message: 'Erro interno do servidor!' });
    }
});

module.exports = router;
