import { Router } from "express";
import multer from "multer";
import path from "path";
import { handleCsvUpload, handleGerarRelatorioPorLote, handlePdfUpload } from "../controllers/boletos.controller";

const router = Router();

// Configura o multer para uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = file.mimetype === "text/csv"
      ? path.resolve(__dirname, "..", "uploads", "csv")
      : path.resolve(__dirname, "..", "uploads", "pdf");
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// boletos.routes.ts
router.post("/upload/csv", upload.single("file"), handleCsvUpload);
router.post("/upload/pdf", upload.single("file"), handlePdfUpload);
router.get("/lotes/:loteId/relatorio", handleGerarRelatorioPorLote);


export default router;
