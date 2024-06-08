import { Router } from 'express';
import { createPurchases,  getAllPurchases } from '../controller/compraController';

const router = Router();

router.post('/compras', createPurchases);
router.get('/compras', getAllPurchases);

export default router;
