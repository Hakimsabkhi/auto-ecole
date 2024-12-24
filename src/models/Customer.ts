import mongoose, { Document, Schema } from "mongoose";
import { ICompany } from "./Company";
import CustomerCounter from "./CustomerCounter";

export interface ICustomer extends Document {
  ref: string;
  cin: number;
  firstname: string;
  lastname: string;
  phone: number;  // Changed to string to allow flexibility
  address: string;
  company: ICompany | string;
  createdAt?: Date;
  updatedAt?: Date;
}

const CustomerSchema: Schema = new Schema(
  {
    ref: { type: String },
    cin: { type: Number, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    phone: { type: Number, required: false },  // Changed to string
    address: { type: String, required: false },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  },
  { timestamps: true }
);



// Pre-save hook to automatically generate the ref
CustomerSchema.pre<ICustomer>('save', async function (next) {
  if (!this.ref) {
    // Get the counter for "CUST" and increment it
    const counter = await CustomerCounter.findOneAndUpdate(
      { name: 'CL' },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );

    // Generate ref in the format "CUST-0000001", "CUST-0000002", etc.
    this.ref = `CL-${counter.count.toString().padStart(7, '0')}`;  // Fixed string interpolation
  }
  next();
});
const Customer = mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema);

export default Customer;