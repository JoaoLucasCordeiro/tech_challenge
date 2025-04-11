import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import boletosRoutes from "./routes/boletos.routes";
import { initDB } from "./database";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Garante que as pastas de upload existam
const ensureUploadDirs = () => {
  const csvDir = path.resolve(__dirname, "uploads/csv");
  const pdfDir = path.resolve(__dirname, "uploads/pdf");
  const boletosPdfDir = path.resolve(__dirname, "boletos");

  [csvDir, pdfDir, boletosPdfDir].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Rotas principais
app.use("/pdfs", express.static(path.resolve(__dirname, "uploads/pdf")));
app.use("/boletos-pdf", express.static(path.resolve(__dirname, "boletos")));
app.use("/boletos", boletosRoutes);

// Inicializar banco e iniciar o servidor
initDB()
  .then(() => {
    ensureUploadDirs();

    const PORT = process.env.PORT || 3333;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erro ao iniciar o banco:", err);
  });
