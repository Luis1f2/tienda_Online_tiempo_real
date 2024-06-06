import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Producto from '../model/ProducModel';
import Purchase from '../model/compraModels';

export const createPurchase = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, quantity } = req.body;

    
    console.log('Datos recibidos:', { productId, quantity });

   

    // Convertir productId a ObjectId
    const productObjectId = new mongoose.Types.ObjectId(productId);

    // Encontrar el producto
    const producto = await Producto.findById(productObjectId);
    if (!producto) {
      res.status(404).json({ message: 'Producto no encontrado' });
      return;
    }

    // Verificar si hay suficiente cantidad
    if (producto.cantidad < quantity) {
      res.status(400).json({ message: 'No se cuenta con suficiente productos' });
      return;
    }

    // Crear la compra
    const purchase = new Purchase({
      productId: productObjectId,
      quantity,
    });
    await purchase.save();

    // Restar la cantidad comprada del producto
    producto.cantidad -= quantity;
    await producto.save();

    res.status(201).json(purchase);
  } catch (error) {
    console.error('Error en createPurchase:', error); 
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'huy fatal error todo acabo' });
    }
  }
};
