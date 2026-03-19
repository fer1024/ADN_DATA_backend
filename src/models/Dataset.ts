import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IDataset extends Document {
    name: string
    source: string
    description: string
    records: number
    acquisitionDate: string
    phase: string
    project: Types.ObjectId
    createdBy: Types.ObjectId
}

const DatasetSchema: Schema = new Schema({
    name:            { type: String, trim: true, required: true },
    source:          { type: String, trim: true, required: true },
    description:     { type: String, trim: true, required: true },
    records:         { type: Number, default: 0 },
    acquisitionDate: { type: String, required: true },
    phase:           { type: String, required: true },
    project:         { type: Types.ObjectId, ref: 'Project', required: true },
    createdBy:       { type: Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true })

const Dataset = mongoose.model<IDataset>('Dataset', DatasetSchema)
export default Dataset