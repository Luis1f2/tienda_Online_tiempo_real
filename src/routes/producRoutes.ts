import { Router } from 'express';
import {
  crearProducto,
  obtenerProductos,
  obtenerProductoPorId,
  actualizarCantidadProducto,
  verificarProductoAgotado,
  eliminarProducto
} from '../controller/producController';

const router = Router();

router.post('/productos', crearProducto);
router.get('/productos', obtenerProductos);
router.get('/productos/:id', obtenerProductoPorId);
router.put('/productos/:id/cantidad', actualizarCantidadProducto);
router.get('/productos/:id/verificar', verificarProductoAgotado);
router.delete('/productos/:id', eliminarProducto);

export default router;
