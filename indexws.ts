import { WebSocketServer, WebSocket } from 'ws';
import jwt from 'jsonwebtoken';
import connectDB from './src/config/database';
import Comment from './src/model/comentariosModel';
import User from './src/model/userModel';
import { Types } from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const PORT = 8080;

connectDB();

const secret = process.env.JWT_SECRET;

if (!secret) {
    throw new Error('JWT secret not defined');
}

const wss = new WebSocketServer({ port: PORT });

wss.on('connection', (ws: WebSocket & { userId?: string }) => {
  console.log('Cliente conectado');

  ws.on('message', async (message: string) => {
    try {
      const parsedMessage = JSON.parse(message);
      console.log('Mensaje recibido:', parsedMessage);

      const { token, ...rest } = parsedMessage;

      if (!ws.userId) {
        try {
          if (!token) {
            throw new Error('Token no proporcionado');
          }

          console.log('Token recibido:', token);

          const decoded = jwt.verify(token, secret) as { id: string };
          ws.userId = decoded.id;
          console.log('Usuario autenticado:', ws.userId);
        } catch (error) {
          console.error('Error verificando el token:', error);
          ws.send(JSON.stringify({ error: 'Token incorrecto aplique otro' }));
          ws.close();
          return;
        }
      }

      const { type, data } = rest;

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
      ws.send(JSON.stringify({ error: 'Error procesando el mensaje' }));
    }
  });

  ws.on('close', () => {
    console.log('Cliente desconectado');
  });

  ws.send('¡Bienvenido al servidor WebSocket!');
});

console.log(`Servidor WebSocket corriendo en el puerto ${PORT}`);

const handleCreateComment = async (ws: WebSocket & { userId?: string }, data: any) => {
  try {
    if (!ws.userId) {
      ws.send(JSON.stringify({ error: 'Usuario no autenticado' }));
      return;
    }

    const user = await User.findById(ws.userId);
    if (!user) {
      ws.send(JSON.stringify({ error: 'Usuario no encontrado' }));
      return;
    }

    const { message } = data;
    const newComment = new Comment({
      username: user.username,
      message,
      replies: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await newComment.save();

    broadcast({ type: 'create', data: newComment });
  } catch (error) {
    console.error('Error creando comentario:', error);
    ws.send(JSON.stringify({ error: 'Error creando comentario' }));
  }
};

const handleEditComment = async (ws: WebSocket, data: any) => {
  try {
    const { commentId, message } = data;
    const comment = await Comment.findById(commentId);

    if (comment) {
      comment.message = message;
      comment.updatedAt = new Date();
      await comment.save();
      broadcast({ type: 'edit', data: comment });
    } else {
      ws.send(JSON.stringify({ error: 'Comentario no encontrado' }));
    }
  } catch (error) {
    console.error('Error editando comentario:', error);
    ws.send(JSON.stringify({ error: 'Error editando comentario' }));
  }
};

const handleDeleteComment = async (ws: WebSocket, data: any) => {
  try {
    const { commentId } = data;
    const comment = await Comment.findByIdAndDelete(commentId);

    if (comment) {
      broadcast({ type: 'delete', data: { commentId } });
    } else {
      ws.send(JSON.stringify({ error: 'Comentario no encontrado' }));
    }
  } catch (error) {
    console.error('Error eliminando comentario:', error);
    ws.send(JSON.stringify({ error: 'Error eliminando comentario' }));
  }
};

const handleReplyToComment = async (ws: WebSocket & { userId?: string }, data: any) => {
  try {
    if (!ws.userId) {
      ws.send(JSON.stringify({ error: 'Usuario no autenticado' }));
      return;
    }

    const user = await User.findById(ws.userId);
    if (!user) {
      ws.send(JSON.stringify({ error: 'Usuario no encontrado' }));
      return;
    }

    const { commentId, message } = data;
    const parentComment = await Comment.findById(commentId);

    if (parentComment) {
      const reply = new Comment({
        username: user.username,
        message,
        replies: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await reply.save();

      if (!Array.isArray(parentComment.replies)) {
        parentComment.replies = [];
      }
      parentComment.replies.push(reply._id as Types.ObjectId);
      parentComment.updatedAt = new Date();
      await parentComment.save();

      broadcast({ type: 'reply', data: reply });
    } else {
      ws.send(JSON.stringify({ error: 'Comentario padre no encontrado' }));
    }
  } catch (error) {
    console.error('Error respondiendo al comentario:', error);
    ws.send(JSON.stringify({ error: 'Error respondiendo al comentario' }));
  }
};

const handleGetComments = async (ws: WebSocket, data: any) => {
  try {
    const comments = await Comment.find({});
    ws.send(JSON.stringify({ type: 'get', data: comments }));
  } catch (error) {
    console.error('Error obteniendo comentarios:', error);
    ws.send(JSON.stringify({ error: 'Error obteniendo comentarios' }));
  }
};

const broadcast = (message: any) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};
