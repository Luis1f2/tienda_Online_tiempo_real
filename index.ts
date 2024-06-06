import express from "express";
import cors from "cors";
import bodyParser from 'body-parser';
import connectDB from './src/config/database';
import userRoutes from './src/routes/userRoutes';
import compraRutas from './src/routes/compraRutas'
import dotenv from 'dotenv'
import producRoutes from './src/routes/producRoutes'

const app = express();
app.use(express.json());
dotenv.config();
connectDB();

const port = process.env.port || 3000;

const corsOptions = {
    origin: 'http://localhost:3000', 
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions))
app.use(bodyParser.json());
// Rutas
app.use('/usuario', userRoutes);
app.use('/producto',producRoutes);
app.use('/compra',compraRutas)



app.get('/', (req, res) => {
    res.send('que hubo muchacho si funciono');
});

    app.listen(port, () => {
        console.log(`servidor corriendo en direccion http://localhost:${port}`);
});
