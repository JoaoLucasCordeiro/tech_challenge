import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { getDB } from "../database";

export async function gerarRelatorioPorLote(loteId: number): Promise<string> {
  const db = getDB();

  const lote = await db.get("SELECT * FROM lotes WHERE id = ?", [loteId]);
  if (!lote) {
    throw new Error("Lote não encontrado");
  }

  const boletos = await db.all("SELECT * FROM boletos WHERE id_lote = ?", [loteId]);

  const doc = new PDFDocument({ margin: 30 });
  const filePath = path.resolve(__dirname, "..", "boletos", `relatorio-lote-${loteId}.pdf`);
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text(`Relatório do Lote: ${lote.nome} (ID: ${lote.id})`, { align: "center" });
  doc.moveDown();

  boletos.forEach((boleto) => {
    doc
      .fontSize(12)
      .text(`Nome: ${boleto.nome}`)
      .text(`CPF: ${boleto.cpf}`)
      .text(`Unidade: ${boleto.unidade || "-"}`)
      .text(`Valor: R$ ${boleto.valor.toFixed(2)}`)
      .text(`Vencimento: ${boleto.vencimento}`)
      .text(`Linha Digitável: ${boleto.linha_digitavel}`)
      .moveDown();
  });

  doc.end();

  return filePath;
}
