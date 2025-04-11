import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { importarCSV } from "../services/boletos.service";
import { importarPDF } from "../services/boletos.service";
import { gerarRelatorioPorLote } from "../services/relatorios.service";


export const handleCsvUpload = async (req: Request, res: Response) => {
  const file = req.file;

  if (!file) return res.status(400).json({ message: "CSV não enviado." });

  const filePath = path.resolve(file.path);

  try {
    await importarCSV(filePath);
    fs.unlinkSync(filePath); 
    res.status(200).json({ message: "Boletos importados com sucesso." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao importar boletos." });
  }
};

export const handlePdfUpload = async (req: Request, res: Response) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "Arquivo PDF não enviado." });
  }

  try {
    await importarPDF(file.path)
    fs.unlinkSync(file.path);
    return res.status(200).json({ message: "Boletos via PDF importados com sucesso." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao importar boletos via PDF." });
  }
};

export async function handleGerarRelatorioPorLote(req: Request, res: Response) {
  const loteId = Number(req.params.loteId);
  if (isNaN(loteId)) {
    return res.status(400).json({ message: "ID do lote inválido" });
  }

  try {
    const filePath = await gerarRelatorioPorLote(loteId);
    return res.download(filePath);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao gerar relatório" });
  }
}
