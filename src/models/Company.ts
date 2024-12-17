import mongoose, { Document, Schema } from "mongoose";
import { ISubscription } from "./Subscription";
import { IAdmin } from "./Admin";

export interface ICompany extends Document {
  name: string;
  username: string;
  phone: number;
  password: string;
  subscription: ISubscription | string;
  admin: IAdmin | string;
  dateSub: string;
  datestart:string;
  on:boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const CompanySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    phone: { type: Number },
    password: { type: String },
    subscription: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription" },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    datestart:{type:String},
    datesub: { type: String },
    on:{type:Boolean,default:true}

  },
  { timestamps: true }
);

export default mongoose.models.Company || mongoose.model<ICompany>("Company", CompanySchema);
