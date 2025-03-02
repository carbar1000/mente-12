import { createClient } from '@supabase/supabase-js'
import { google } from 'googleapis'

export default async function handler(req, res) {
  // Configurações de segurança
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' })
  }

  // Credenciais seguras via variáveis de ambiente
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_ANON_KEY
  const googleSheetCredentials = JSON.parse(process.env.GOOGLE_SHEET_CREDENTIALS)
  const spreadsheetId = process.env.GOOGLE_SHEET_ID

  try {
    // 1. Validar dados recebidos
    const formData = req.body
    if (!formData || Object.keys(formData).length === 0) {
      return res.status(400).json({ error: 'Dados do formulário inválidos' })
    }

    // 2. Preparar dados para envio
    const dataToSend = {
      nome: formData.Nome,
      email: formData.Email,
      cor: formData.A,
      animal: formData.B,
      hobby: formData.C,
      timestamp: new Date().toISOString()
    }

    // 3. Envio para Supabase (em paralelo)
    const supabase = createClient(supabaseUrl, supabaseKey)
    const supabasePromise = supabase
      .from('respostas')
      .insert([dataToSend])

    // 4. Envio para Google Sheets (em paralelo)
    const googleSheetsPromise = new Promise((resolve, reject) => {
      const client = new google.auth.GoogleAuth({
        credentials: googleSheetCredentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
      })

      const googleSheets = google.sheets({ version: 'v4', auth: client })
      
      googleSheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Sheet1!A:E',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: [
            [
              dataToSend.nome, 
              dataToSend.email, 
              dataToSend.cor, 
              dataToSend.animal, 
              dataToSend.hobby
            ]
          ]
        }
      }, (err, result) => {
        if (err) reject(err)
        else resolve(result)
      })
    })

    // 5. Executar envios em paralelo
    const [supabaseResult, googleSheetsResult] = await Promise.all([
      supabasePromise,
      googleSheetsPromise
    ])

    // 6. Verificar erros em ambos os envios
    if (supabaseResult.error) {
      console.error('Erro no Supabase:', supabaseResult.error)
      throw new Error('Falha ao salvar no Supabase')
    }

    // 7. Resposta de sucesso
    res.status(200).json({ 
      message: 'Dados salvos com sucesso', 
      redirectUrl: '/obrigado.html' 
    })

  } catch (error) {
    console.error('Erro no envio:', error)
    res.status(500).json({ 
      error: 'Erro ao processar formulário', 
      details: error.message 
    })
  }
}

