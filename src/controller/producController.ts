import { Request, Response } from 'express';
import Producto from '../model/ProducModel';
import { notifyClients } from './longPollingControllers';

// Crear un nuevo producto
export const crearProducto = async (req: Request, res: Response): Promise<void> => {
  try {
    const producto = new Producto(req.body);
    await producto.save();
    res.status(201).json(producto);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: 'producto no creado' });
    }
  }
};

// Obtener todos los productos
export const obtenerProductos = async (req: Request, res: Response): Promise<void> => {
  try {
    const productos = await Producto.find();
    res.status(200).json(productos);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: 'algo paso' });
    }
  }
};

// Obtener un producto por ID
export const obtenerProductoPorId = async (req: Request, res: Response): Promise<void> => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (producto) {
      res.status(200).json(producto);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: 'Error algo paso' });
    }
  }
};


// Actualizar la cantidad de un producto
export const actualizarCantidadProducto = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cantidad } = req.body;
    const productoId = req.params.id;

    const producto = await Producto.findByIdAndUpdate(
      productoId,
      { cantidad },
      { new: true, runValidators: true, context: 'query' }
    );

    if (producto) {
      await notifyClients(productoId);

      res.status(200).json(producto);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error: unknown) {
    console.error('Error en actualizarCantidadProducto:', error);
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: 'Algo pasó' });
    }
  }
};
// Verificar si un producto está agotado
export const verificarProductoAgotado = async (req: Request, res: Response): Promise<void> => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (producto) {
      const message = producto.cantidad > 0 ? 'Producto disponible' : 'Producto agotado';
      res.status(200).json({ message, producto });
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: 'An unknown error occurred' });
    }
  }
};

// Eliminar un producto
export const eliminarProducto = async (req: Request, res: Response): Promise<void> => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (producto) {
      res.status(200).json({ message: 'Producto eliminado correctamente' });
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: 'An unknown error occurred' });
    }
  }
};

