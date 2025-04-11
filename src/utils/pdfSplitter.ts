import fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";
import { v4 as uuidv4 } from "uuid";

export async function splitPdfIntoPages(filePath: string): Promise<string[]> {
  const data = fs.readFileSync(filePath);
  const pdfDoc = await PDFDocument.load(data);
  const numPages = pdfDoc.getPageCount();
  const outputDir = path.resolve("src/boletos");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const pagePaths: string[] = [];

  for (let i = 0; i < numPages; i++) {
    const newPdf = await PDFDocument.create();
    const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
    newPdf.addPage(copiedPage);

    const pdfBytes = await newPdf.save();
    const outputPath = path.join(outputDir, `${uuidv4()}.pdf`);
    fs.writeFileSync(outputPath, pdfBytes);

    pagePaths.push(outputPath);
  }

  return pagePaths;
}
