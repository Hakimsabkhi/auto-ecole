import mongoose, { Document, Schema } from "mongoose";
import { ICompany } from "./Company";
import ActiviteCounter from "./ActiviteCounter";
import { ICustomer } from "./Customer";

export interface IActivite extends Document {
  ref: string;
  customerid: ICustomer|string;
  activites: string;
  mt: string;
  mp: string;  // Changed to string to allow flexibility
  nht: string;
  nhe: string;
  dateexam: Date;
  status:string;
  company: ICompany | string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ActiviteSchema: Schema = new Schema(
  {
    ref: { type: String},
    customerid: {type:mongoose.Schema.Types.ObjectId,ref:'Customer'},
    activites: { type: String, required: true },
    mt: {type: String,required: false },
    mp: {type: String,required: false },  // Changed to string to allow flexibility
    nht: {type: String,required: false },
    nhe: {type: String,required: false },
    dateexam: {type: Date,required: false },
    status:{type:String,default:"en-coure"},
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

    // Generate ref in the format "AN-0000001", "AN-0000002", etc.
    this.ref = `AN-${counter.count.toString().padStart(7, '0')}`;  // Fixed string interpolation
  }
  next();
});
export default mongoose.models.Activite || mongoose.model<IActivite>('Activite', ActiviteSchema);
