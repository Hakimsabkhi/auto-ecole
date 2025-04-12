import mongoose, { Document, Schema } from "mongoose";
import { ICompany } from "./Company";
import { ITask } from "./Task";

export interface IDealings extends Document {
    date:Date;
    activite:ITask|string;
    hstart:string;
    hfinish:string;
    status:boolean;
    company:ICompany|string;
}

const DealingsSchema: Schema = new Schema(
  {
    date:{type:Date,required:true},
    activite:{type:mongoose.Schema.Types.ObjectId,ref:"Task"},
    hstart:{type:String,required:true},
    hfinish:{type:String,required:true},
    status:{type:Boolean,required:false},
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  },
  { timestamps: true }
);



export default mongoose.models.Dealings || mongoose.model<IDealings>('Dealings', DealingsSchema);
