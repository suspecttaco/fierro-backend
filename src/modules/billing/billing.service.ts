import { billingRepository } from './billing.repository';
import type { CreateTaxProfileInput, UpdateTaxProfileInput } from './billing.schema';

export const billingService = {

  getTaxProfiles: async (userId: string) => {
    return billingRepository.findTaxProfilesByUser(userId);
  },

  createTaxProfile: async (input: CreateTaxProfileInput, userId: string) => {
    return billingRepository.createTaxProfile(userId, {
      tax_id:         input.taxId,
      legal_name:     input.legalName,
      fiscal_address: input.fiscalAddress,
      tax_regime:     input.taxRegime,
      cfdi_use:       input.cfdiUse,
      is_default:     input.isDefault,
    });
  },

  updateTaxProfile: async (taxProfileId: string, input: UpdateTaxProfileInput, userId: string) => {
    const profile = await billingRepository.findTaxProfileById(taxProfileId, userId);
    if (!profile) {
      const err: any = new Error('Perfil fiscal no encontrado');
      err.statusCode = 404;
      err.code = 'TAX_PROFILE_NOT_FOUND';
      throw err;
    }
    return billingRepository.updateTaxProfile(taxProfileId, userId, {
      ...(input.taxId         && { tax_id:         input.taxId }),
      ...(input.legalName     && { legal_name:     input.legalName }),
      ...(input.fiscalAddress && { fiscal_address: input.fiscalAddress }),
      ...(input.taxRegime     && { tax_regime:     input.taxRegime }),
      ...(input.cfdiUse       && { cfdi_use:       input.cfdiUse }),
      ...(input.isDefault !== undefined && { is_default: input.isDefault }),
    });
  },

  deleteTaxProfile: async (taxProfileId: string, userId: string) => {
    const profile = await billingRepository.findTaxProfileById(taxProfileId, userId);
    if (!profile) {
      const err: any = new Error('Perfil fiscal no encontrado');
      err.statusCode = 404;
      err.code = 'TAX_PROFILE_NOT_FOUND';
      throw err;
    }
    await billingRepository.deleteTaxProfile(taxProfileId);
    return { message: 'Perfil fiscal eliminado.' };
  },

  getInvoices: async (userId: string) => {
    return billingRepository.findInvoicesByUser(userId);
  },

  getInvoiceById: async (invoiceId: string, userId: string, isAdmin = false) => {
    const invoice = await billingRepository.findInvoiceById(invoiceId);
    if (!invoice) {
      const err: any = new Error('Factura no encontrada');
      err.statusCode = 404;
      err.code = 'INVOICE_NOT_FOUND';
      throw err;
    }
    if (!isAdmin && invoice.order.user_id !== userId) {
      const err: any = new Error('No autorizado');
      err.statusCode = 403;
      err.code = 'FORBIDDEN';
      throw err;
    }
    return invoice;
  },
};