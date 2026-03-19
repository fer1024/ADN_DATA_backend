import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IExperiment extends Document {
    name: string
    algorithmModel: string   // renombrado de 'model' — conflicto con Mongoose Document
    parameters: string
    metric: string
    result: string
    conclusion: string
    phase: string
    project: Types.ObjectId
    createdBy: Types.ObjectId
}

const ExperimentSchema: Schema = new Schema({
    name:           { type: String, trim: true, required: true },
    algorithmModel: { type: String, trim: true, required: true },
    parameters:     { type: String, trim: true, required: true },
    metric:         { type: String, trim: true, required: true },
    result:         { type: String, trim: true, required: true },
    conclusion:     { type: String, trim: true, required: true },
    phase:          { type: String, required: true },
    project:        { type: Types.ObjectId, ref: 'Project', required: true },
    createdBy:      { type: Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true })

const Experiment = mongoose.model<IExperiment>('Experiment', ExperimentSchema)
export default Experiment