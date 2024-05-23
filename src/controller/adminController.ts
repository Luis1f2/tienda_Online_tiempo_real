import { Request, Response } from 'express';
import mongoose from 'mongoose';

export const verColecciones = async (req: Request, res: Response): Promise<void> => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    res.status(200).json(collections.map(c => c.name));
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las colecciones', error });
  }
};

export const eliminarColeccion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre } = req.params;
    await mongoose.connection.db.dropCollection(nombre);
    res.status(200).json({ message: `Colección ${nombre} eliminada` });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la colección', error });
  }
};
