// src/routes/boletos.routes.ts
import { Router } from "express";
import multer from "multer";
import { handleCsvUpload } from "../controllers/boletos.controller";

const boletosRoutes = Router();

const upload = multer({ dest: "src/uploads/csv" });

boletosRoutes.post("/upload", upload.single("file"), handleCsvUpload);

export default boletosRoutes;
