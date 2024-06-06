import { Schema, model, Document, Types } from 'mongoose';

interface IPurchase extends Document {
  productId: Types.ObjectId;
  quantity: number;
  compraDato: Date;
}

const PurchaseSchema = new Schema<IPurchase>({
  productId: { type: Schema.Types.ObjectId, ref: 'Producto', required: true },
  quantity: { type: Number, required: true },
  compraDato: { type: Date, default: Date.now },
});

const Purchase = model<IPurchase>('Purchase', PurchaseSchema);

export default Purchase;

