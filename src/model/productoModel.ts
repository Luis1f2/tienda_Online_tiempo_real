import mongoose, { Schema, Document } from 'mongoose';

interface IProducto extends Document {
    nombre: string;
    descripcion?: string;
    precio: number;
    stock: number;
    src:string;
    categoria?: string;
}

const productoSchema: Schema = new Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String },
    precio: { type: Number, required: true },
    stock: { type: Number, required: true },
    categoria: { type: String },
});

const Producto = mongoose.model<IProducto>('Producto', productoSchema);

export default Producto;
