import mongoose, { Document, Schema } from "mongoose";
import { ICompany } from "./Company";
import ActiviteCounter from "./ActiviteCounter";
import { ICustomer } from "./Customer";

export interface IActivite extends Document {
  ref: string;
  customerid: ICustomer|string;
  activites: string;
  mt: number;
  mp: number;  // Changed to string to allow flexibility
  nht: number;
  nhe: number;
  dateexam: Date;
  company: ICompany | string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ActiviteSchema: Schema = new Schema(
  {
    ref: { type: String,required: false },
    customerid: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    activites: { type: String, required: true },
    mt: {type: Number,required: false },
    mp: {type: Number,required: false },  // Changed to string to allow flexibility
    nht: {type: Number,required: false },
    nhe: {type: Number,required: false },
    dateexam: {type: Date,required: false },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  },
  { timestamps: true }
);



// Pre-save hook to automatically generate the ref
ActiviteSchema.pre<IActivite>('save', async function (next) {
  if (!this.ref) {
    // Get the counter for "AN" and increment it
    const counter = await ActiviteCounter.findOneAndUpdate(
      { name: 'AN' },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );

    // Generate ref in the format "CUST-0000001", "CUST-0000002", etc.
    this.ref = `AN-${counter.count.toString().padStart(7, '0')}`;  // Fixed string interpolation
  }
  next();
});
const Activite = mongoose.models.Activite || mongoose.model<IActivite>('Activite', ActiviteSchema);

export default Activite;