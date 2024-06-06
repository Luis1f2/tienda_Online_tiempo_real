import { Router } from 'express';
import { registerUser, loginUser  } from '../controller/authControllers';
import { authenticateToken } from '../middleware/authMiddleware';
import {getUsers} from '../controller/userController'

const router = Router();

// Rutas públicas
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users', getUsers);


router.get('/profile', authenticateToken, (req, res) => {
    res.send('ruta protegida');
});

export default router;
