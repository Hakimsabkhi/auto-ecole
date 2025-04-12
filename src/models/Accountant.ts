import mongoose, { Document, Schema } from "mongoose";
import { ICompany } from "./Company";
export interface IAccountant extends Document {
  name: string;
  username: string;
  phone: string;
  password?: number;
  company: ICompany | string;
  createdAt?: Date;
  updatedAt?: Date;
}

const AccountantSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    phone: { type: Number },
    password: { type: String },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  },
  { timestamps: true }
);

export default mongoose.models.Accountant|| mongoose.model<IAccountant>("Accountant", AccountantSchema);
