import type { Request, Response } from 'express'
import Task from '../models/Task'
import Dataset from '../models/Dataset'
import Experiment from '../models/Experiment'
import Decision from '../models/Decision'

export class ReportController {

    static getProjectReport = async (req: Request, res: Response) => {
        try {
            const projectId = req.project.id

            const [tasks, datasets, experiments, decisions] = await Promise.all([
                Task.find({ project: projectId })
                    .populate('assignedTo', 'name email _id')
                    .populate('completedBy.user', 'name'),
                Dataset.find({ project: projectId }).populate('createdBy', 'name'),
                Experiment.find({ project: projectId }).populate('createdBy', 'name'),
                Decision.find({ project: projectId }).populate('createdBy', 'name'),
            ])

            // Tareas estancadas: en onHold o inProgress sin actualizarse en más de 7 días
            const sevenDaysAgo = new Date()
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
            const stalledTasks = tasks.filter(t =>
                ['onHold', 'inProgress', 'underReview'].includes(t.status) &&
                new Date(t.updatedAt as Date) < sevenDaysAgo
            )

            res.json({ tasks, datasets, experiments, decisions, stalledTasks })
        } catch (error) {
            res.status(500).json({ error: 'Error al generar el reporte' })
        }
    }
}
