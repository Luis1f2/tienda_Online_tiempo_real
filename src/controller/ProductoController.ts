import { Response, Request } from "express";
import Producto from "../model/productoModel";

export const crearProducto = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nombre, precio, descripcion, categoria, stock } = req.body;
        const nuevoProducto = new Producto({
        nombre,
        precio,
        descripcion,
        categoria,
        stock
    });
    const productoGuardado = await nuevoProducto.save();
    res.status(201).json(productoGuardado);
    } catch (error) {
     res.status(500).json({ message: 'Error al crear el producto', error });
    }
  };
  
  // Obtener todos los productos
  export const obtenerProductos = async (req: Request, res: Response): Promise<void> => {
    try {
      const productos = await Producto.find();
      res.status(200).json(productos);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los productos', error });
    }
  };
  
  // Obtener la cantidad total de productos
  export const obtenerCantidadProductos = async (req: Request, res: Response): Promise<void> => {
    try {
      const cantidad = await Producto.countDocuments();
      res.status(200).json({ cantidad });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener la cantidad de productos', error });
    }
  };