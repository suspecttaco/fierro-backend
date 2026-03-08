import { Router } from "express";
import { billingController } from "./billing.controller";
import { authenticate } from "../../middleware/auth";

const router = Router();

router.get('/tax-profiles', authenticate, billingController.getTaxProfiles);
router.post('/tax-profiles', authenticate, billingController.createTaxProfile);
router.put('/tax-profiles/:id', authenticate, billingController.updateTaxProfile);
router.delete('/tax-profiles/:id', authenticate, billingController.deleteTaxProfile);
router.get('/invoices', authenticate, billingController.getInvoices);
router.get('/invoices/:id', authenticate, billingController.getInvoiceById);

export default router;