import mongoose, { Document, Schema } from "mongoose";
import { ICompany } from "./Company";
import { IActivite } from "./Activite";

export interface IWorking extends Document {
    date:Date;
    activite:[IActivite]|[string];
    hstart:string;
    hfinish:string;
    company:ICompany|string;
}

const WorkingSchema: Schema = new Schema(
  {
    date:{type:Date,required:true},
    activite:{type:[mongoose.Schema.Types.ObjectId],ref:"Activite"},
    hstart:{type:String,required:true},
    hfinish:{type:String,required:true},
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  },
  { timestamps: true }
);



export default mongoose.models.Working || mongoose.model<IWorking>('Working', WorkingSchema);
