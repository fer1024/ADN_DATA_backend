import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IDecision extends Document {
    description: string
    justification: string
    alternatives: string
    phase: string
    project: Types.ObjectId
    createdBy: Types.ObjectId
}

const DecisionSchema: Schema = new Schema({
    description:   { type: String, trim: true, required: true },
    justification: { type: String, trim: true, required: true },
    alternatives:  { type: String, trim: true, default: '' },
    phase:         { type: String, required: true },
    project:       { type: Types.ObjectId, ref: 'Project', required: true },
    createdBy:     { type: Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true })

const Decision = mongoose.model<IDecision>('Decision', DecisionSchema)
export default Decision