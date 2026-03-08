import { prisma } from "../../lib/prisma";

export const billingRepository = {
    
    findTaxProfilesByUser: async (userId: string) => {
        return prisma.tax_profile.findMany({
            where: { user_id: userId },
            orderBy: { is_default: 'desc' },
        });
    },

    findTaxProfileById: async (taxProfileId: string, userId: string) => {
        return prisma.tax_profile.findFirst({
            where: { tax_profile_id: taxProfileId, user_id: userId },
        });
    },

    createTaxProfile: async (userId: string, data: {
        tax_id: string;
        legal_name: string;
        fiscal_address: string;
        tax_regime?: string;
        cfdi_use?: string;
        is_default: boolean;
    }) => {
        if (data.is_default) {
            await prisma.tax_profile.updateMany({
                where: { user_id: userId },
                data: { is_default: false },
            });
        }
        return prisma.tax_profile.create({ data: { ...data, user_id: userId }});
    },

    updateTaxProfile: async (taxProfileId: string, userId: string, data: {
        tax_id?: string;
        legal_name?: string;
        fiscal_address?: string;
        tax_regime?: string;
        cfdi_use?: string;
        is_default?: boolean;
    }) => {
        if (data.is_default) {
            await prisma.tax_profile.updateMany({
                where: { user_id: userId },
                data: { is_default: false },
            });
        }
        return prisma.tax_profile.update({
            where: { tax_profile_id: taxProfileId },
            data,
        });
    },

    deleteTaxProfile: async (taxProfileId: string) => {
        return prisma.tax_profile.delete({ where: { tax_profile_id: taxProfileId } });
    },

    findInvoicesByUser: async (userId: string) => {
        return prisma.invoice.findMany({
            where: { order: { user_id: userId } },
            orderBy: { created_at: 'desc' },
            include: { invoice_item: true },
        });
    },

    findInvoiceById: async (invoiceId: string) => {
        return prisma.invoice.findUnique({
            where: { invoice_id: invoiceId },
            include: { invoice_item: true, order: true, tax_profile: true },
        });
    },
};