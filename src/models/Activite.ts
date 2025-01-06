import mongoose, { Schema, Document } from "mongoose";
import { ICompany } from "./Company";

export  interface IActivite extends Document {
  name: string;
  prix: number;
  company:ICompany|string;
}

const ActiviteSchema = new Schema<IActivite>({
  name: { type: String, required: true},
  prix: { type: Number, required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
});


export default mongoose.models.Activite || mongoose.model<IActivite>("Activite", ActiviteSchema);
