import mongoose, { Schema, Model, Document } from "mongoose";

export interface IScript extends Document {
  userId?: string; // optional for now, can store anonymous scripts
  idea: string;
  amount: number;
  content: string;
  createdAt: Date;
}

const ScriptSchema = new Schema<IScript>(
  {
    userId: {
      type: String,
      required: false,
    },
    idea: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
      max: 200,
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "scripts",
  },
);

export const Script: Model<IScript> =
  (mongoose.models.Script as Model<IScript>) ||
  mongoose.model<IScript>("Script", ScriptSchema);
