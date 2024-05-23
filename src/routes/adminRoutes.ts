import { Router } from 'express';
import { verColecciones, eliminarColeccion } from '../controller/adminController';

const router = Router();

router.get('/colecciones', verColecciones);
router.delete('/colecciones/:nombre', eliminarColeccion);

export default router;
