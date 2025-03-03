require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const submitRouter = require('./api/submit');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware para analisar o corpo das requisições
app.use(bodyParser.json());

// Usar o roteador para o endpoint /api
app.use('/api', submitRouter);

app.use(express.static(path.join(__dirname))); // Serve arquivos estáticos

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
