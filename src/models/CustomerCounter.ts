import mongoose, { Document, Schema } from "mongoose";
import { ICompany } from "./Company";

// Define the interface for the CustomerCounter model.
interface ICustomerCounter extends Document {
  name: string;
  count: number;
  company:ICompany|string;
  
}

// Check if the model already exists to avoid overwriting.
const CustomerCounterSchema: Schema<ICustomerCounter> = new Schema<ICustomerCounter>({
  name: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
});

// Using the `mongoose.models` object to check if the model is already defined
const CustomerCounter = mongoose.models.CustomerCounter || mongoose.model<ICustomerCounter>('CustomerCounter', CustomerCounterSchema);

export default CustomerCounter;
