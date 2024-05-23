import { Router } from 'express';
import { crearCompra, obtenerCompras } from "../controller/comprasController";

const router = Router();

router.post('/compras', crearCompra);
router.get('/compras', obtenerCompras);

export default router;
