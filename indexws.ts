import { WebSocketServer, WebSocket } from 'ws';
import connectDB from './src/config/database';
import Comment from './src/model/comentariosModel';
import { Types } from 'mongoose';

const PORT = 8080;

connectDB();

const wss = new WebSocketServer({ port: PORT });

wss.on('connection', (ws: WebSocket) => {
  console.log('Cliente conectado');

  ws.on('message', async (message: string) => {
    try {
      const { type, data } = JSON.parse(message);

      switch (type) {
        case 'create':
          await handleCreateComment(ws, data);
          break;
        case 'edit':
          await handleEditComment(ws, data);
          break;
        case 'delete':
          await handleDeleteComment(ws, data);
          break;
        case 'reply':
          await handleReplyToComment(ws, data);
          break;
        case 'get':
          await handleGetComments(ws, data);
          break;
        default:
          ws.send(JSON.stringify({ error: 'Tipo de mensaje desconocido' }));
      }
    } catch (error) {
      console.error('Error procesando el mensaje:', error);
      ws.send('Error procesando el mensaje');
    }
  });

  ws.on('close', () => {
    console.log('Cliente desconectado');
  });

  ws.send('¡Bienvenido al servidor WebSocket!');
});

console.log(`Servidor WebSocket corriendo en el puerto ${PORT}`);

const handleCreateComment = async (ws: WebSocket, data: any) => {
  const { username, message } = data;
  const newComment = new Comment({ username, message, replies: [] });
  await newComment.save();

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'create', data: newComment }));
    }
  });
};

const handleEditComment = async (ws: WebSocket, data: any) => {
  const { commentId, message } = data;
  const comment = await Comment.findById(commentId);

  if (comment) {
    comment.message = message;
    await comment.save();

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'edit', data: comment }));
      }
    });
  } else {
    ws.send(JSON.stringify({ error: 'Comentario no encontrado' }));
  }
};

const handleDeleteComment = async (ws: WebSocket, data: any) => {
  const { commentId } = data;
  const comment = await Comment.findByIdAndDelete(commentId);

  if (comment) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'delete', data: { commentId } }));
      }
    });
  } else {
    ws.send(JSON.stringify({ error: 'Comentario no encontrado' }));
  }
};

const handleReplyToComment = async (ws: WebSocket, data: any) => {
  const { commentId, username, message } = data;
  const parentComment = await Comment.findById(commentId);

  if (parentComment) {
    const reply = new Comment({ username, message, replies: [] });
    await reply.save();

    // Asegurarse de que `parentComment.replies` es un array de `ObjectId`
    if (!Array.isArray(parentComment.replies)) {
      parentComment.replies = [];
    }
    parentComment.replies.push(reply._id as Types.ObjectId);
    await parentComment.save();

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'reply', data: reply }));
      }
    });
  } else {
    ws.send(JSON.stringify({ error: 'Comentario padre no encontrado' }));
  }
};

const handleGetComments = async (ws: WebSocket, data: any) => {
  const comments = await Comment.find({});

  ws.send(JSON.stringify({ type: 'get', data: comments }));
};
