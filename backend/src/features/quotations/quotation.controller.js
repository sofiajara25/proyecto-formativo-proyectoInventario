import { quotationService } from "./quotation.service.js";

export const quotationController = {
    async create(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: "El PDF de la cotización es obligatorio" });
            }
            const pdfUrl = `uploads/${req.file.filename}`;
            const quotation = await quotationService.createQuotation({
                ...req.body,
                pdfUrl,
            });
            res.status(201).json({
                message: "Cotización creada correctamente",
                quotation,
            });
        } catch (err) {
            console.error("ERROR BACKEND:", err);
            res.status(500).json({ error: err.message });
        }
    },

    async list(req, res) {
        try {
            const quotations = await quotationService.getAllQuotations();
            res.status(200).json(quotations);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const quotation = await quotationService.getQuotationById(id);
            if (!quotation) return res.status(404).json({ error: "Cotización no encontrada" });
            res.status(200).json(quotation);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const updated = await quotationService.updateQuotationStatus(id, status);
            if (!updated) return res.status(404).json({ error: "Cotización no encontrada" });
            res.status(200).json(updated);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
};
