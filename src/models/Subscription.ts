import mongoose, { Document, Schema, Model } from 'mongoose';
import { IAdmin } from './Admin';

export interface ISubscription extends Document {
  name: string;
  price:number;
  life:number;
  status:string;
  pricingstatus:string;
  admin:IAdmin|string;
  createdAt?: Date;
  updatedAt?: Date;

}

const SubscriptionSchema: Schema = new Schema({
  name: { type: String, required: true },
  price:{type:Number},
  life: { type: Number, required: true },
  status:{type:String,default:'Inactive'},
  pricingstatus:{type:String,required:true},
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
 
},{ timestamps: true });

const Subscription: Model<ISubscription> = mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema);

export default Subscription;