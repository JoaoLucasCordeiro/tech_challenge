// src/database/index.ts
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

let dbInstance: Awaited<ReturnType<typeof open>>;

export async function initDB() {
  dbInstance = await open({
    filename: path.resolve(__dirname, "../../database.sqlite"),
    driver: sqlite3.Database,
  });

  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS boletos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      cpf TEXT NOT NULL,
      valor REAL NOT NULL,
      vencimento TEXT NOT NULL,
      pdf_path TEXT,
      id_lote INTEGER,
      ativo BOOLEAN DEFAULT 1,
      criado_em TEXT DEFAULT CURRENT_TIMESTAMP
    );
  
    CREATE TABLE IF NOT EXISTS lotes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      ativo BOOLEAN DEFAULT 1,
      criado_em TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
  

  return dbInstance;
}

export function getDB() {
  if (!dbInstance) {
    throw new Error("DB not initialized. Call initDB() first.");
  }
  return dbInstance;
}
