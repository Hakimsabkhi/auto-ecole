import mongoose, { Schema, Document } from "mongoose";
import { ICompany } from "./Company";

interface IActiviteCounter extends Document {
  name: string;
  count: number;
   company:ICompany|string;
}

const ActiviteCounterSchema = new Schema<IActiviteCounter>({
  name: { type: String, required: true, unique: true },
  count: { type: Number, required: true, default: 0 },
   company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
});

const ActiviteCounter = mongoose.models.ActiviteCounter || mongoose.model<IActiviteCounter>('ActiviteCounter', ActiviteCounterSchema);
export default ActiviteCounter;
