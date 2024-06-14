import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import connectDB from './src/config/database';
import userRoutes from './src/routes/userRoutes';
import compraRutas from './src/routes/compraRutas';
import producRoutes from './src/routes/producRoutes';

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: ['http://localhost:3001', 'http://localhost:3000'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json()); // Asegura que el cuerpo de la solicitud sea analizado como JSON

// Middleware para depuración
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  console.log('Request body:', req.body);
  next();
});

// Rutas
app.use('/usuario', userRoutes);
app.use('/producto', producRoutes);
app.use('/compra', compraRutas);

app.get('/', (req: Request, res: Response) => {
  res.send('¡Hola! El servidor está funcionando correctamente.');
});


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en dirección http://localhost:${port}`);
});
