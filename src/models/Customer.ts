import mongoose, { Document, Schema } from "mongoose";
import { ICompany } from "./Company";
import { IWorker } from "./Worker";

export interface ICustomer extends Document {
  cin:number;
  firstname: string;
  lastname: string;
  phone: string;
  company: ICompany | string;
  activities:string[];
  total:number;
  avance:number;
  worker: (IWorker | string)[];
  numbheurestotal:number;
  numbheureseffectuer:number;
  dateexcode:Date;
  dateexconduit:Date;
  dateexpark:Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const CustomerSchema: Schema = new Schema(
  {
    cin:{type:Number,required:true},
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    phone: { type: Number, required: false },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    activities: { type: [String], required: false }, // Optional physical address
    total:{ type: Number, required: false },
    avance:{ type: Number, required: false },
    worker: { type: [mongoose.Schema.Types.ObjectId], ref: "Worker" },
    numbheurestotal:{ type: Number, required: false },
    numbheureseffectuer:{ type: Number, required: false },
    dateexcode:{ type: Date, required: false },
    dateexconduit:{ type: Date, required: false },
    dateexpark:{ type: Date, required: false },
  },
  { timestamps: true }
);

export default mongoose.models.Customer|| mongoose.model<ICustomer>("Customer", CustomerSchema);
