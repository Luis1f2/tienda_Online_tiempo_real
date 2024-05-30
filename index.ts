import express from "express";
import cors from "cors";
import bodyParser from 'body-parser';
import connectDB from './src/config/database';
import userRoutes from './src/routes/userRoutes';

const app = express();
app.use(bodyParser.json());
connectDB();

const port = 3000;

const corsOptions = {
    origin: 'http://localhost:3000', // Reemplaza esto con tu dominio
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Rutas
app.use('/usuario', userRoutes);

app.get('/', (req, res) => {
    res.send('que hubo muchacho si funciono');
});

    app.listen(port, () => {
        console.log(`servidor corriendo en direccion http://localhost:${port}`);
});
