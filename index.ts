import express, {Request, Response} from 'express';
import {Server} from 'ws'

const app = express();
const port = 3000;

app.use(express.json());

const server = app.listen(port, ()=>{
    console.log(`Servidor corriendo el pueto http://localhost:${port}`)
});

app.get('/',(req:Request, res:Response)=>{
    res.send('Hello, estamos en linea');
})

// Crear el servidor WebSocket
const wss = new Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    ws.send(`Hello, you sent -> ${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});