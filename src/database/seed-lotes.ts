// src/database/seed-lotes.ts
import { getDB } from ".";
import { initDB } from ".";

async function seed() {
  const db = await initDB();

  const lotes = ["0017", "0018", "0019"];

  for (const nome of lotes) {
    await db.run(
      `INSERT INTO lotes (nome) VALUES (?)`,
      [nome]
    );
  }

  console.log("Lotes inseridos com sucesso.");
}

seed().catch((err) => {
  console.error("Erro ao inserir lotes:", err);
});
