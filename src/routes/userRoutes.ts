import { Router } from 'express';
import { registerUser, loginUser,odtenerUsuarios  } from '../controller/userController';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/user',odtenerUsuarios )

export default router;
