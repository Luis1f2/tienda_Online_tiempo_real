import express from 'express';
import pollingRoutes from './src/routes/pollingRoutes';
import http from 'http';
import dotenv from 'dotenv'
import { Server } from 'ws';
import ProductoRoutes from './src/routes/productoRoutes';
import ComprasRoutes from './src/routes/comprasRoutes'
import adminRoutes from './src/routes/adminRoutes'
import WebSocketController from './src/controller/websocketController';
import connectDB from './src/config/database';

dotenv.config();
connectDB();


const app = express();

app.use(express.json());

app.use('/', pollingRoutes);
app.use('/compra', ProductoRoutes);
app.use('/compra', ComprasRoutes);
app.use('/admin', adminRoutes)

const server = http.createServer(app);
const wss = new Server({ server });

new WebSocketController(wss);

const PORT = process.env.PORT || 3000;

wss.on('connection', (ws) => {
    console.log('Cliente conectado');
  
    ws.on('close', () => {
      console.log('Cliente desconectado');
    });
  });

server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

export { wss };