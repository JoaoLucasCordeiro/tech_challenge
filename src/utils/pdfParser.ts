import fs from "fs";
// @ts-ignore
import pdfParse from "pdf-parse";


export async function extractBoletoDataFromPDF(filePath: string): Promise<{
  nome: string;
  cpf: string;
  unidade: string;
  valor: number;
  vencimento: Date;
  linha_digitavel: string;
} | null> {
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);

  const texto = data.text;

  console.log("Texto extraído do PDF:", texto); // ajuda a ajustar os regex

  // Aqui você ajusta os regex de acordo com a estrutura do PDF
  const nome = /Nome:\s*(.+)/.exec(texto)?.[1]?.trim() ?? "Desconhecido";
  const cpf = /CPF:\s*([\d.-]+)/.exec(texto)?.[1] ?? "000.000.000-00";
  const unidade = /Unidade:\s*(\d+)/.exec(texto)?.[1] ?? "0001";
  const valorStr = /Valor:\s*([\d.,]+)/.exec(texto)?.[1]?.replace(",", ".") ?? "0";
  const valor = parseFloat(valorStr);
  const vencimentoStr = /Vencimento:\s*([\d/]+)/.exec(texto)?.[1];
  const vencimento = vencimentoStr
    ? new Date(vencimentoStr.split("/").reverse().join("-"))
    : new Date();
  const linha_digitavel = /Linha Digitável:\s*([\d\s.]+)/.exec(texto)?.[1]?.replace(/\s/g, "") ?? "";

  if (!nome || !valor || !linha_digitavel) {
    return null;
  }

  return {
    nome,
    cpf,
    unidade,
    valor,
    vencimento,
    linha_digitavel
  };
}
