import mongoose, { Schema } from "mongoose";
import { ICompany } from "./Company";

export interface ICar {
  model: string;
  bn: string;
  vd: Date;
  company: ICompany | string;
}

const CarSchema = new Schema<ICar>({
  model: { type: String, required: true },
  bn: { type: String, required: true },
  vd: { type: Date, required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
});

export default mongoose.models.Car || mongoose.model<ICar>("Car", CarSchema);
