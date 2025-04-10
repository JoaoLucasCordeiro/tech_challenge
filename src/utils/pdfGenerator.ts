// src/utils/pdfGenerator.ts
import PDFDocument from "pdfkit";
import fs from "fs";

type BoletoData = {
  nome: string;
  cpf: string;
  valor: number;
  vencimento: Date;
};

export const generatePdf = async (boleto: BoletoData, outputPath: string) => {
  return new Promise<void>((resolve, reject) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(outputPath);

    doc.pipe(stream);

    doc.fontSize(20).text("Boleto Bancário", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Nome: ${boleto.nome}`);
    doc.text(`CPF: ${boleto.cpf}`);
    doc.text(`Valor: R$ ${boleto.valor.toFixed(2)}`);
    doc.text(`Vencimento: ${boleto.vencimento.toLocaleDateString("pt-BR")}`);

    doc.end();

    stream.on("finish", resolve);
    stream.on("error", reject);
  });
};
