import mongoose, { Schema, Document } from "mongoose";

export interface ISnack { name: string; price: number; }
export interface ISnackDocument extends ISnack, Document {}


const snackSchema = new Schema<ISnackDocument>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
}, { timestamps: true });


export const Snack = mongoose.models.Snack || mongoose.model<ISnackDocument>("Snack", snackSchema);