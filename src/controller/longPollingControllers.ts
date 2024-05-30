import { Request, Response } from 'express';
import Producto from '../model/ProducModel';

let clients: any[] = [];

export const registerClient = (req: Request, res: Response) => {
  const clientId = req.params.id;

  const client = {
    id: clientId,
    res,
  };

  clients.push(client);

  // Configura el timeout para evitar conexiones colgadas indefinidamente
  req.on('close', () => {
    clients = clients.filter(c => c.id !== clientId);
  });
};

export const notifyClients = async (productId: string) => {
  const product = await Producto.findById(productId);

  clients.forEach(client => {
    if (client.id === productId) {
      client.res.json(product);
    }
  });

  clients = clients.filter(client => client.id !== productId);
};

export const actualizarCantidadProducto = async (req: Request, res: Response) => {
  try {
    const { cantidad } = req.body;
    const producto = await Producto.findById(req.params.id);

    if (producto) {
      producto.cantidad = cantidad;
      await producto.save();

      // Notificar a los clientes del cambio
      notifyClients(req.params.id);

      res.status(200).json(producto);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};