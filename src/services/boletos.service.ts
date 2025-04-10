import path from "path";
import { generatePdf } from "../utils/pdfGenerator";
import { getDB } from "../database";

export const saveBoleto = async (boleto: any) => {
  const db = getDB(); // <- pegar instância inicializada

  const { nome, cpf, valor, vencimento } = boleto;

  // Inserir no banco (exemplo básico)
  const result = await db.run(
    `INSERT INTO boletos (nome, cpf, valor, vencimento) VALUES (?, ?, ?, ?)`,
    [nome, cpf, valor, vencimento.toISOString()]
  );

  const id = result.lastID;

  // Gerar PDF
  const pdfPath = path.resolve(`src/boletos/${id}.pdf`);
  await generatePdf(boleto, pdfPath);
};
