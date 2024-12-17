// Example for Admin model
import mongoose, { Document, Schema } from "mongoose";

export interface IAdmin extends Document {
  username: string;
  password: string;
  name?: string;
}

const AdminSchema = new Schema<IAdmin>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String },
});

export default mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);

