import { Schema, model, Document } from 'mongoose';

interface IProducto extends Document {
    img:string;
    nombre: string;
    descripcion: string;
    precio: number;
    cantidad: number;
}

const productoSchema = new Schema<IProducto>({
    img:{type: String, required: true},
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true },
    cantidad: { type: Number, required: true },
});

const Producto = model<IProducto>('Producto', productoSchema);

export default Producto;
