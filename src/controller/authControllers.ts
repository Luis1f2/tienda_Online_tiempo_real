import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../model/userModel';

const secret =  'clave_secreta'; 

declare module 'express-serve-static-core' {
    interface Request {
        user?: string; 
    }
}

// Registro de usuario
export const registerUser = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({ username, email, password });
        await user.save();

        const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });

        res.status(201).json({ token });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'error desconocido' });
        }
    }
};

// Inicio de sesión de usuario
export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'contraseña o email incorrectas' });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'a ocurrido un error inesperado' });
        }
    }
};

// Verificar Token
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'acceso denegado, token incorrecto!' });
    }

    try {
        const decoded = jwt.verify(token, secret) as { id: string };
        req.user = decoded.id;
        next();
    } catch (error) {
        if (error instanceof Error) {
            res.status(401).json({ message: 'token invalido!' });
        } else {
            res.status(401).json({ message: 'un error a ocurrido' });
        }
    }
};
