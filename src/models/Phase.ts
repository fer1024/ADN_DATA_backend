import mongoose, { Schema, Document } from "mongoose";

export interface IPhase extends Document {
  name: string
  order: number
  project: mongoose.Types.ObjectId
}

const PhaseSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: "Project"
  }
})

export default mongoose.model<IPhase>("Phase", PhaseSchema)