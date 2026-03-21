import mongoose, { Schema, Document, Types } from 'mongoose'
import Note from './Note'

const taskStatus = {
    PENDING: 'pending',
    ON_HOLD: 'onHold',
    IN_PROGRESS: 'inProgress',
    UNDER_REVIEW: 'underReview',
    COMPLETED: 'completed'
} as const

const taskPhase = {
    BUSINESS: 'business',
    DATA_UNDERSTANDING: 'data_understanding',
    DATA_PREPARATION: 'data_preparation',
    MODELING: 'modeling',
    EVALUATION: 'evaluation',
    DEPLOYMENT: 'deployment'
} as const

export type TaskStatus = typeof taskStatus[keyof typeof taskStatus]
export type TaskPhase = typeof taskPhase[keyof typeof taskPhase]

export interface ITask extends Document {
    name: string
    description: string
    project: Types.ObjectId
    phase: TaskPhase        // fase CRISP-DM donde vive la tarea
    status: TaskStatus      // estado interno dentro de la fase
    completed: boolean      // checkbox independiente
    assignedTo: Types.ObjectId | null
    startedAt: Date | null       // se registra cuando pasa de pending a cualquier otro estado
    finishedAt: Date | null      // se registra cuando llega a completed
    completedBy: { user: Types.ObjectId; status: TaskStatus }[]
    notes: Types.ObjectId[]
    estimatedHours: number | null   // horas estimadas para la tarea
    priority: 'high' | 'medium' | 'low' | null  // prioridad de la tarea
    deadline: Date | null          // fecha límite de entrega
    createdAt: Date    
    updatedAt: Date
}

export const TaskSchema: Schema = new Schema({
    name: { type: String, trim: true, required: true },
    description: { type: String, trim: true, required: true },
    project: { type: Types.ObjectId, ref: 'Project' },
    phase: {
        type: String,
        enum: Object.values(taskPhase),
        default: taskPhase.BUSINESS
    },
    status: {
        type: String,
        enum: Object.values(taskStatus),
        default: taskStatus.PENDING
    },
    completed: { type: Boolean, default: false },
    assignedTo:  { type: Types.ObjectId, ref: 'User', default: null },
    startedAt:   { type: Date, default: null },
    finishedAt:  { type: Date, default: null },
    completedBy: [{
        user: { type: Types.ObjectId, ref: 'User', default: null },
        status: { type: String, enum: Object.values(taskStatus), default: taskStatus.PENDING }
    }],
    notes: [{ type: Types.ObjectId, ref: 'Note' }],
    estimatedHours: { type: Number, default: null },
    priority: { type: String, enum: ['high', 'medium', 'low'], default: null },
    deadline: { type: Date, default: null }
}, { timestamps: true })

TaskSchema.pre('deleteOne', { document: true }, async function () {
    const taskId = this._id
    if (!taskId) return
    await Note.deleteMany({ task: taskId })
})

const Task = mongoose.model<ITask>('Task', TaskSchema)
export default Task
