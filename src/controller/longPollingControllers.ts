import { Request, Response } from 'express';
import Producto from '../model/ProducModel';

interface Client {
  id: string;
  res: Response;
}

let clients: Client[] = [];

// Registrar un cliente para notificaciones
export const registerClient = (req: Request, res: Response): void => {
  const clientId = req.params.id;

  const client: Client = {
    id: clientId,
    res,
  };

  clients.push(client);

  // Configura el timeout para evitar conexiones colgadas indefinidamente
  req.on('close', () => {
    clients = clients.filter(c => c.id !== clientId);
  });
};

// Notificar a los clientes del cambio en el producto
export const notifyClients = async (productId: string): Promise<void> => {
  const product = await Producto.findById(productId);

  clients.forEach(client => {
    if (client.id === productId) {
      client.res.json(product);
    }
  });

  clients = clients.filter(client => client.id !== productId);
};
