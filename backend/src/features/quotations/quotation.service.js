import { quotationRepository } from "./quotation.repository.js";

export const quotationService = {
    async createQuotation(data) {
        const quotationData = {
            ...data,
            quotationName: data.quotationName?.trim(),
        };
        return await quotationRepository.create(quotationData);
    },

    async getAllQuotations() {
        return await quotationRepository.findAll();
    },

    async getQuotationById(id) {
        return await quotationRepository.findById(id);
    },

    async getQuotationsByIds(ids) {
        return await quotationRepository.findByIds(ids);
    },

    async updateQuotationStatus(id, status) {
        return await quotationRepository.updateStatus(id, status);
    },
};
