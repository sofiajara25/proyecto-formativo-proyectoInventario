import { Router } from "express";
import multer from "multer";
import path from "path";

import { quotationController } from "./quotation.controller.js";

const router = Router();

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (_req, file, cb) => {
        const extension = path.extname(file.originalname) || ".pdf";
        const uniqueName = `quotation-${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
        cb(null, uniqueName);
    },
});

// Solo se aceptan PDFs: la cotización se sube una sola vez y debe quedar
// siempre en ese formato (para que FileViewer la pueda previsualizar
// embebida con <iframe>, igual que la ficha técnica).
const upload = multer({
    storage,
    fileFilter: (_req, file, cb) => {
        if (file.mimetype !== "application/pdf") {
            return cb(new Error("La cotización debe ser un archivo PDF"));
        }
        cb(null, true);
    },
});

router.post("/", upload.single("pdf"), quotationController.create);
router.get("/", quotationController.list);
router.get("/:id", quotationController.getById);
router.patch("/:id/status", quotationController.updateStatus);

export default router;
