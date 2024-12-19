import mongoose, { Document, Schema } from "mongoose";
import { ICompany } from "./Company";

export interface IWorker extends Document {
  name: string;
  username: string;
  phone: string;
  password?: number;
  formateur:string;
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
    formateur:{type:String,required:true},
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  },
  { timestamps: true }
);

export default mongoose.models.Worker|| mongoose.model<IWorker>("Worker", WorkerSchema);
