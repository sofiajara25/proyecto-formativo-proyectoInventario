import { Router } from "express";
import multer from "multer";
import path from "path";

import { quotationController } from "./quotation.controller.js";
import { authenticateToken } from "../../middlewares/auth.middleware.js";
import { requirePermission } from "../../middlewares/permission.middleware.js";

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

router.post(
    "/",
    authenticateToken,
    requirePermission("create_quotation"),
    upload.single("pdf"),
    quotationController.create,
);
router.get("/", authenticateToken, requirePermission("list_quotation"), quotationController.list);
router.get("/:id", authenticateToken, requirePermission("view_quotation"), quotationController.getById);
router.patch("/:id/status", authenticateToken, requirePermission("state_quotation"), quotationController.updateStatus);

export default router;
