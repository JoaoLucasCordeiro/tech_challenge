import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import boletosRoutes from "./routes/boletos.routes";
import { initDB } from "./database";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rota para servir PDFs gerados
app.use("/pdfs", express.static(path.resolve(__dirname, "uploads/pdf")));

// Rotas
app.use("/boletos", boletosRoutes);

// Inicializar banco e iniciar servidor
initDB().then(() => {
  const PORT = process.env.PORT || 3333;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error("Erro ao iniciar o banco:", err);
});
