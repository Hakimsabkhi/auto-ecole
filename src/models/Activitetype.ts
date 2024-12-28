import mongoose, { Schema, Document } from "mongoose";
import { ICompany } from "./Company";

export  interface IActiviteType extends Document {
  name: string;
  prix: number;
  company:ICompany|string;
}

const ActiviteTypeSchema = new Schema<IActiviteType>({
  name: { type: String, required: true},
  prix: { type: Number, required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
});


export default mongoose.models.ActiviteType || mongoose.model<IActiviteType>("ActiviteType", ActiviteTypeSchema);
