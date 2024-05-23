import { Request, Response } from 'express';
import Compra from "../model/compraModels";
import Producto from "../model/productoModel";
import { wss } from '@index';


export const crearCompra = async (req: Request, res: Response): Promise<void> => {
    try {
      const { productos } = req.body;
      const nuevaCompra = new Compra({
        productos
      });
      const compraGuardada = await nuevaCompra.save();
  
      // Actualizar stock de productos
      for (const item of productos) {
        const producto = await Producto.findById(item.productoId);
        if (producto) {
          producto.stock -= item.cantidad;
          await producto.save();
        }
      }
  
      // Enviar notificación a través de WebSocket
      wss.clients.forEach(client => {
        if (client.readyState === client.OPEN) {
          client.send(JSON.stringify({ type: 'compra', data: compraGuardada }));
        }
      });
  
      res.status(201).json(compraGuardada);
    } catch (error) {
      res.status(500).json({ message: 'Error al crear la compra', error });
    }
  };
  
  export const obtenerCompras = async (req: Request, res: Response): Promise<void> => {
    try {
      const compras = await Compra.find().populate('productos.productoId');
      res.status(200).json(compras);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener las compras', error });
    }
  };