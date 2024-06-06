import { Router } from 'express';
import { createPurchase } from '../controller/compraController';

const router = Router();

router.post('/compras', createPurchase);

export default router;
