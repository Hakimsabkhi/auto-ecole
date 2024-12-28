import mongoose, { Document, Schema } from "mongoose";
import { ICompany } from "./Company";
import {IActiviteType} from "./Activitetype";
export interface IWorker extends Document {
  name: string;
  username: string;
  phone: string;
  password?: number;
  formateur:IActiviteType[]|string[];
  company: ICompany | string;
  createdAt?: Date;
  updatedAt?: Date;
}

const WorkerSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    phone: { type: Number },
    password: { type: String },
    formateur: [{ type: mongoose.Schema.Types.ObjectId, ref: "ActiviteType" }], // Allowing multiple activity type references
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  },
  { timestamps: true }
);

export default mongoose.models.Worker|| mongoose.model<IWorker>("Worker", WorkerSchema);
