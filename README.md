# 📄 Desafio Técnico - API de Importação e Relatórios de Boletos

API desenvolvida com Node.js, Express e SQLite para importar boletos via arquivos `.csv` e `.pdf`, armazená-los no banco de dados e gerar relatórios em PDF por lote.

## 🛠 Tecnologias

- Node.js + TypeScript
- Express
- SQLite (com SQLite3)
- Sequelize
- Multer (upload de arquivos)
- pdf-lib e pdfkit (geração e manipulação de PDFs)
- csv-parser (leitura de CSV)

---

## 🚀 Como rodar o projeto

```bash
# Clonar o repositório
git clone <url-do-repositório>

# Acessar a pasta do projeto
cd nome-do-projeto

# Instalar dependências
npm install

# Rodar o servidor
npm run dev

# ⚠️ O banco de dados (database.sqlite) será criado automaticamente na raiz do projeto ao iniciar a aplicação.