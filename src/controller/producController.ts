import { Request, Response } from 'express';
import Producto from '../model/ProducModel';

// Crear un nuevo producto
export const crearProducto = async (req: Request, res: Response) => {
  try {
    const producto = new Producto(req.body);
    await producto.save();
    res.status(201).json(producto);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener todos los productos
export const obtenerProductos = async (req: Request, res: Response) => {
  try {
    const productos = await Producto.find();
    res.status(200).json(productos);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener un producto por ID
export const obtenerProductoPorId = async (req: Request, res: Response) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (producto) {
      res.status(200).json(producto);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Actualizar la cantidad de un producto
export const actualizarCantidadProducto = async (req: Request, res: Response) => {
  try {
    const { cantidad } = req.body;
    const producto = await Producto.findById(req.params.id);
    if (producto) {
      producto.cantidad = cantidad;
      await producto.save();
      res.status(200).json(producto);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Verificar si un producto está agotado
export const verificarProductoAgotado = async (req: Request, res: Response) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (producto) {
      const message = producto.cantidad > 0 ? 'Producto disponible' : 'Producto agotado';
      res.status(200).json({ message, producto });
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
