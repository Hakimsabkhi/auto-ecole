import mongoose, { Document, Schema } from "mongoose";
import { ICompany } from "./Company";
import ActiviteCounter from "./ActiviteCounter";
import { ICustomer } from "./Customer";
import { IWorker } from "./Worker";
import { IActivite } from "./Activite";
import { ICar } from "./Car";

export interface ITask extends Document {
  ref: string;
  customer: ICustomer|string;
  worker:IWorker|string
  activites: IActivite|string;
  car: ICar|string;
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

const TaskSchema: Schema = new Schema(
  {
    ref: { type: String},
    customer: {type:mongoose.Schema.Types.ObjectId,ref:'Customer'},
    worker:{type:mongoose.Schema.Types.ObjectId,ref:'Worker'},
    activites: { type:mongoose.Schema.Types.ObjectId,ref:'Activite'},
    car: { type:mongoose.Schema.Types.ObjectId,ref:'Car'},
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
TaskSchema.pre<ITask>('save', async function (next) {
  if (!this.ref) {
   // Define the filter condition for the counter, including the company
   const filter = { name: 'AN', company: this.company };
    const counter = await ActiviteCounter.findOneAndUpdate(
       filter ,
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );

    // Generate ref in the format "AN-0000001", "AN-0000002", etc.
    this.ref = `AN-${counter.count.toString().padStart(7, '0')}`;  // Fixed string interpolation
  }
  next();
});
export default mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);
