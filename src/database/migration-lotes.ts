import { initDB } from "."; // ou './index', se preferir

async function migrate() {
  const db = await initDB(); // inicializa o banco

  await db.exec(`
    CREATE TABLE IF NOT EXISTS lotes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      ativo BOOLEAN DEFAULT 1,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log("Tabela 'lotes' criada com sucesso.");
}

migrate().catch((err) => {
  console.error("Erro ao criar tabela 'lotes':", err);
});
