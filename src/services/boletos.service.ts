import path from "path";
import { generateCsvBoletoPdf, generatePdf } from "../utils/pdfGenerator";
import { getDB } from "../database";
import fs from "fs";
import csv from "csv-parser";
import { splitPdfIntoPages } from "../utils/pdfSplitter";
import { extractBoletoDataFromPDF } from "../utils/pdfParser";


interface BoletoCSV {
  nome: string;
  unidade: string;
  valor: string;
  linha_digitavel: string;
  cpf: string;
  vencimento: string; // esperado no formato "yyyy-mm-dd" ou ISO
}

export async function importarCSV(caminhoCsv: string) {
  const db = getDB();
  const boletos: BoletoCSV[] = [];

  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(caminhoCsv)
      .pipe(csv({ separator: ";" }))
      .on("data", (data: BoletoCSV) => boletos.push(data))
      .on("end", async () => {
        try {
          for (const boleto of boletos) {
            const nomeLote = boleto.unidade.padStart(4, "0");

            const lote = await db.get(
              `SELECT id FROM lotes WHERE nome = ?`,
              [nomeLote]
            );

            if (!lote) {
              console.warn(
                `Lote "${nomeLote}" não encontrado. Ignorando boleto de ${boleto.nome}.`
              );
              continue;
            }

            const vencimentoDate = new Date(boleto.vencimento);
            if (isNaN(vencimentoDate.getTime())) {
              console.warn(`Data de vencimento inválida para boleto de ${boleto.nome}. Ignorando.`);
              continue;
            }

            const result = await db.run(
              `INSERT INTO boletos (nome, cpf, valor, vencimento, linha_digitavel, id_lote, ativo, criado_em)
               VALUES (?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP)`,
              [
                boleto.nome,
                boleto.cpf,
                parseFloat(boleto.valor),
                vencimentoDate.toISOString(),
                boleto.linha_digitavel,
                lote.id
              ]
            );

            const boletoId = result.lastID;

            // Montar dados para o PDF
            const boletoCompleto = {
              id: boletoId!,
              nome: boleto.nome,
              unidade: nomeLote,
              cpf: boleto.cpf,
              valor: parseFloat(boleto.valor),
              vencimento: vencimentoDate,
              linha_digitavel: boleto.linha_digitavel,
            };

            const pdfDir = path.resolve("src/boletos");
            if (!fs.existsSync(pdfDir)) {
              fs.mkdirSync(pdfDir, { recursive: true });
            }

            const pdfPath = path.join(pdfDir, `${boletoId}.pdf`);
            await generateCsvBoletoPdf(boletoCompleto, pdfPath);

            // Atualizar boleto com caminho do PDF
            await db.run(`UPDATE boletos SET pdf_path = ? WHERE id = ?`, [
              pdfPath,
              boletoId,
            ]);
          }

          console.log("Boletos importados e PDFs gerados com sucesso!");
          resolve();
        } catch (err) {
          reject(err);
        }
      })
      .on("error", reject);
  });
}

// --- Para outro fluxo com boletos completos ---
export const saveBoleto = async (boleto: {
  nome: string;
  cpf: string;
  valor: number;
  vencimento: Date;
}) => {
  const db = getDB();

  const result = await db.run(
    `INSERT INTO boletos (nome, cpf, valor, vencimento) VALUES (?, ?, ?, ?)`,
    [boleto.nome, boleto.cpf, boleto.valor, boleto.vencimento.toISOString()]
  );

  const id = result.lastID;

  const pdfPath = path.resolve(`src/boletos/${id}.pdf`);
  await generatePdf(boleto, pdfPath);
};


export async function importarPDF(caminhoPdf: string) {
  const db = getDB();

  const paginas = await splitPdfIntoPages(caminhoPdf);
  const boletos = [];

  for (const [index, paginaPath] of paginas.entries()) {
    const dados = await extractBoletoDataFromPDF(paginaPath);

    if (!dados) {
      console.warn(`Página ${index + 1} ignorada: dados inválidos.`);
      continue;
    }

    const nomeLote = dados.unidade.padStart(4, "0");

    const lote = await db.get(`SELECT id FROM lotes WHERE nome = ?`, [
      nomeLote,
    ]);

    if (!lote) {
      console.warn(`Lote "${nomeLote}" não encontrado. Ignorando boleto.`);
      continue;
    }

    const result = await db.run(
      `INSERT INTO boletos (nome, cpf, valor, vencimento, linha_digitavel, pdf_path, id_lote, ativo, criado_em)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP)`,
      [
        dados.nome,
        dados.cpf,
        dados.valor,
        dados.vencimento.toISOString(),
        dados.linha_digitavel,
        paginaPath,
        lote.id,
      ]
    );

    console.log(`Boleto da página ${index + 1} inserido com id ${result.lastID}`);
    boletos.push(result.lastID);
  }

  return boletos;
}
