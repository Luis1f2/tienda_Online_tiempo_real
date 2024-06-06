import { WebSocketServer, WebSocket } from 'ws';
import connectDB from './src/config/database';
import Comment from './src/model/comentariosModel';

const PORT = 8080;

connectDB();

const wss = new WebSocketServer({ port: PORT });

wss.on('connection', (ws: WebSocket) => {
  console.log('Client connected');

  ws.on('message', async (message: string) => {
    const { productId, username, comment } = JSON.parse(message);
    const newComment = new Comment({
      productId,
      username,
      message: comment,
    });
    await newComment.save();

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(newComment));
      }
    });
  });

  ws.on('close', () => {
    console.log('Cliente desconectado');
  });

  ws.send('Bienbenido al websocked server!');
});

console.log(`WebSocket servidor conectado ${PORT}`);