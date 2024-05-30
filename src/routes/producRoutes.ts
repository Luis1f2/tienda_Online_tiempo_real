import { Router } from 'express';
import {
    crearProducto,
    obtenerProductos,
    obtenerProductoPorId,
    actualizarCantidadProducto,
    verificarProductoAgotado
} from '../controller/producController';
import { registerClient } from '../controller/longPollingControllers';

const router = Router();

router.post('/productos', crearProducto);
router.get('/productos', obtenerProductos);
router.get('/productos/:id', obtenerProductoPorId);
router.patch('/productos/:id/cantidad', actualizarCantidadProducto);
router.get('/productos/:id/verificar', verificarProductoAgotado);

// Long Polling route
router.get('/productos/:id/longpoll', registerClient);

export default router;
