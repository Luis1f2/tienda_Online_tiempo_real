import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Producto from '../model/ProducModel';
import Purchase from '../model/compraModels';

export const createPurchases = async (req: Request, res: Response): Promise<void> => {
  try {
    const purchases = req.body.purchases;
    console.log('Datos recibidos:', purchases);

    const purchaseDocuments = [];

    for (const purchaseData of purchases) {
      const { productId, quantity } = purchaseData;

      const productObjectId = new mongoose.Types.ObjectId(productId);
      const producto = await Producto.findById(productObjectId);

      if (!producto) {
        res.status(404).json({ message: `Producto con ID ${productId} no encontrado` });
        return;
      }

      if (producto.cantidad < quantity) {
        res.status(400).json({ message: `No hay suficiente cantidad del producto con ID ${productId}` });
        return;
      }

      const purchase = new Purchase({
        productId: productObjectId,
        quantity,
      });
      await purchase.save();

      producto.cantidad -= quantity;
      await producto.save();

      purchaseDocuments.push(purchase);
    }

    res.status(201).json(purchaseDocuments);
  } catch (error: unknown) {
    console.error('Error en createPurchases:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'huy fatal error todo acabo' });
    }
  }
};

export const getAllPurchases = async (req: Request, res: Response): Promise<void> => {
  try {
    const purchases = await Purchase.find().populate('productId');
    res.status(200).json(purchases);
  } catch (error: unknown) {
    console.error('Error en getAllPurchases:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'huy fatal error todo acabo' });
    }
  }
};
