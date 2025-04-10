import { Request, Response } from "express";
import csv from "csv-parser";
import fs from "fs";
import path from "path";
import { parseCsvLine } from "../utils/csvParser";
import { saveBoleto } from "../services/boletos.service";


export const handleCsvUpload = async (req: Request, res: Response) => {
  const file = req.file;

  if (!file) return res.status(400).json({ message: "CSV não enviado." });

  const results: any[] = [];

  fs.createReadStream(file.path)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      try {
        for (const row of results) {
          const parsed = parseCsvLine(row);
          await saveBoleto(parsed);
        }

        res.status(200).json({ message: "Boletos processados com sucesso." });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao processar boletos." });
      }
    });
};
