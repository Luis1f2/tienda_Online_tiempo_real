import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Producto from '../model/ProducModel';
import Purchase from '../model/compraModels';

export const createPurchases = async (req: Request, res: Response): Promise<void> => {
  try {
    const purchases = req.body.purchases;

    console.log('Datos recibidos:', purchases);

    const purchaseDocuments = [];
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      for (const purchaseData of purchases) {
        const { productId, quantity } = purchaseData;

        const productObjectId = new mongoose.Types.ObjectId(productId);

        const producto = await Producto.findById(productObjectId).session(session);
        if (!producto) {
          throw new Error(`Producto con ID ${productId} no encontrado`);
        }

        if (producto.cantidad < quantity) {
          throw new Error(`No hay suficiente cantidad del producto con ID ${productId}`);
        }

        const purchase = new Purchase({
          productId: productObjectId,
          quantity,
        });
        await purchase.save({ session });

        producto.cantidad -= quantity;
        await producto.save({ session });

        purchaseDocuments.push(purchase);
      }

      await session.commitTransaction();
      session.endSession();

      res.status(201).json(purchaseDocuments);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
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
  } catch (error) {
    console.error('Error en getAllPurchases:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'huy fatal error todo acabo' });
    }
  }
};
