import mongoose, { Document, Schema } from "mongoose";
import { ICompany } from "./Company";
import { ITask } from "./Task";
export interface IHistorypay extends Document {
  amount:number;
  task:ITask|string
  company: ICompany | string;
  createdAt?: Date;
  updatedAt?: Date;
}

const HistorypaySchema: Schema = new Schema(
  {
    amount: { type: Number, required: true },
    task: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }], // Allowing multiple activity type references
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  },
  { timestamps: true }
);

export default mongoose.models.Historypay|| mongoose.model<IHistorypay>("Historypay", HistorypaySchema);
