import mongoose, { Schema, Document } from "mongoose";

interface IActiviteCounter extends Document {
  name: string;
  count: number;
}

const ActiviteCounterSchema = new Schema<IActiviteCounter>({
  name: { type: String, required: true, unique: true },
  count: { type: Number, required: true, default: 0 },
});

const ActiviteCounter = mongoose.models.ActiviteCounter || mongoose.model<IActiviteCounter>('ActiviteCounter', ActiviteCounterSchema);
export default ActiviteCounter;
