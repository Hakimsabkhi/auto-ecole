import mongoose, { Document, Schema } from "mongoose";

// Define the interface for the ActiviteCounter model.
interface IActiviteCounter extends Document {
  name: string;
  count: number;
}

// Check if the model already exists to avoid overwriting.
const ActiviteCounterSchema: Schema<IActiviteCounter> = new Schema<IActiviteCounter>({
  name: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
});

// Using the `mongoose.models` object to check if the model is already defined
const ActiviteCounter = mongoose.models.ActiviteCounter || mongoose.model<IActiviteCounter>('ActiviteCounter', ActiviteCounterSchema);

export default ActiviteCounter;
