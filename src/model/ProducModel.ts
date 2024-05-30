import { Schema, model, Document } from 'mongoose';

interface IProducto extends Document {
    nombre: string;
    descripcion: string;
    precio: number;
    cantidad: number;
}

const productoSchema = new Schema<IProducto>({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true },
    cantidad: { type: Number, required: true },
});

const Producto = model<IProducto>('Producto', productoSchema);

export default Producto;
