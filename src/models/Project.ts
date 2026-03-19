import mongoose, { Schema, Document, PopulatedDoc, Types } from 'mongoose'
import Task, { ITask } from './Task'
import Phase from './Phase'
import Dataset from './Dataset'
import Experiment from './Experiment'
import Decision from './Decision'
import Note from './Note'
import { IUser } from './User'

export interface IProject extends Document {
    projectName: string
    clientName: string
    description: string
    tasks: PopulatedDoc<ITask & Document>[]
    manager: PopulatedDoc<IUser & Document>
    team: PopulatedDoc<IUser & Document>[]
}

const ProjectSchema: Schema = new Schema({
    projectName: {
        type: String,
        required: true,
        trim: true
    },
    clientName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    tasks: [{ type: Types.ObjectId, ref: 'Task' }],
    manager: { type: Types.ObjectId, ref: 'User' },
    team: [{ type: Types.ObjectId, ref: 'User' }],
}, { timestamps: true })

// Convierte projectName a mayúsculas antes de guardar
ProjectSchema.pre('save', function (next) {
    if (this.isModified('projectName')) {
        this.projectName = (this.projectName as string).toUpperCase()
    }
    next()
})

// Limpieza en cascada al eliminar proyecto
ProjectSchema.pre('deleteOne', { document: true }, async function () {
    const projectId = this._id
    if (!projectId) return

    const tasks = await Task.find({ project: projectId })
    const taskIds = tasks.map(t => t._id)

    await Promise.all([
        Note.deleteMany({ task: { $in: taskIds } }),
        Task.deleteMany({ project: projectId }),
        Phase.deleteMany({ project: projectId }),
        Dataset.deleteMany({ project: projectId }),
        Experiment.deleteMany({ project: projectId }),
        Decision.deleteMany({ project: projectId }),
    ])
})

const Project = mongoose.model<IProject>('Project', ProjectSchema)
export default Project