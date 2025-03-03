# Regras do Projeto

## 1. Objetivo do Projeto
- O projeto é um formulário que funciona no Vercel online.
- O objetivo é enviar respostas para um banco de dados Supabase, na tabela "respostas".
- Após enviar as respostas, deve exibir a página `obrigado.html`.

## 2. Segurança das Variáveis de Ambiente
- As variáveis de ambiente (`SUPABASE_URL`, `SUPABASE_ANON_KEY`) estão configuradas no Vercel e não são expostas publicamente.
- Todo código ou alteração deve respeitar essa regra.

## 3. Ambiente de Desenvolvimento
- O projeto está sendo desenvolvido em um ambiente Windows PowerShell.
- Todos os comandos sugeridos devem ser compatíveis com PowerShell.

## 4. Fluxo do Formulário
- O formulário envia os dados para a API `/api/submit`, que insere as respostas na tabela `respostas` do Supabase.
- Após o envio bem-sucedido, o usuário é redirecionado para a página `obrigado.html`.

## 5.  Deploy
- 

- Para fazer o deploy da aplicação, use:
  ```powershell
  vercel --prod
  ```

## 6. Boas Práticas
- Sempre que sugerir ou criar código, garantir que as variáveis de ambiente não sejam expostas publicamente.
- Respeitar o fluxo do formulário e a segurança do projeto.

## 7. O projeto está a ser criando numa plataforma windows , com powershell
- O projeto está sendo desenvolvido em um ambiente Windows PowerShell.
