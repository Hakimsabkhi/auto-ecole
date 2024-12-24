import mongoose, { Document, Schema } from "mongoose";

// Define the interface for the CustomerCounter model.
interface ICustomerCounter extends Document {
  name: string;
  count: number;
}

// Check if the model already exists to avoid overwriting.
const CustomerCounterSchema: Schema<ICustomerCounter> = new Schema<ICustomerCounter>({
  name: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
});

// Using the `mongoose.models` object to check if the model is already defined
const CustomerCounter = mongoose.models.CustomerCounter || mongoose.model<ICustomerCounter>('CustomerCounter', CustomerCounterSchema);

export default CustomerCounter;
