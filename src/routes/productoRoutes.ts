import { Router } from 'express';
import { crearProducto, obtenerProductos, obtenerCantidadProductos } from "../controller/ProductoController";

const router = Router();

router.post('/productos', crearProducto);
router.get('/productos', obtenerProductos);
router.get('/productos/cantidad', obtenerCantidadProductos);

export default router;