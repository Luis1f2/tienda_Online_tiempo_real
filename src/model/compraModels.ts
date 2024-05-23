import { Schema, model, Document } from 'mongoose';

interface ICompra extends Document {
productos: {
    productoId: Schema.Types.ObjectId;
    cantidad: number;
    }[];
    fecha: Date;
}

const compraSchema = new Schema<ICompra>({
    productos: [
    {
        productoId: {
            type: Schema.Types.ObjectId,
            ref: 'Producto',
            required: true
    },
    cantidad: {
        type: Number,
        required: true
        }
    }
    ],
    fecha: {
    type: Date,
    default: Date.now
}
}, { timestamps: true });

export default model<ICompra>('Compra', compraSchema);
