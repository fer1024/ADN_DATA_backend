import type { Request, Response } from 'express'
import Task from '../models/Task'

export class TaskController {

    static createTask = async (req: Request, res: Response) => {
        try {
            const { name, description, phase, status, assignedTo } = req.body
            const task = new Task({
                name,
                description,
                phase,
                status: status || 'pending',
                completed: false,
                assignedTo: (assignedTo && assignedTo !== '') ? assignedTo : null,
                project: req.project.id
            })
            req.project.tasks.push(task.id)
            await Promise.allSettled([task.save(), req.project.save()])
            res.send('Tarea creada correctamente')
        } catch (error) {
            res.status(500).json({ error: 'Error al crear la tarea' })
        }
    }

    static getProjectTasks = async (req: Request, res: Response) => {
        try {
            const tasks = await Task.find({ project: req.project.id })
                .populate('assignedTo', 'name email _id')
            res.json(tasks)
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener las tareas' })
        }
    }

    static getTaskById = async (req: Request, res: Response) => {
        try {
            const task = await req.task.populate([
                { path: 'completedBy.user', select: 'name email _id' },
                { path: 'notes', populate: { path: 'createdBy', select: 'name email _id' } },
                { path: 'assignedTo', select: 'name email _id' }
            ])
            res.json(task)
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener la tarea' })
        }
    }

    static updateTask = async (req: Request, res: Response) => {
        try {
            const { name, description, assignedTo } = req.body
            req.task.name = name
            req.task.description = description
            if (assignedTo !== undefined) {
                req.task.assignedTo = (assignedTo && assignedTo !== '') ? assignedTo : null
            }
            await req.task.save()
            res.send('Tarea actualizada correctamente')
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar la tarea' })
        }
    }

    static deleteTask = async (req: Request, res: Response) => {
        try {
            req.project.tasks = req.project.tasks.filter(
                task => task.toString() !== req.task.id.toString()
            )
            await Promise.allSettled([req.task.deleteOne(), req.project.save()])
            res.send('Tarea eliminada correctamente')
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar la tarea' })
        }
    }

    static updateStatus = async (req: Request, res: Response) => {
        try {
            const { status } = req.body
            const wasNotStarted = req.task.status === 'pending' && status !== 'pending'
            const isNowCompleted = status === 'completed'
            const wasCompleted = req.task.status === 'completed' && status !== 'completed'

            req.task.status = status

            // Registra inicio cuando sale de pending por primera vez
            if (wasNotStarted && !req.task.startedAt) {
                req.task.startedAt = new Date()
            }
            // Registra fin cuando llega a completed
            if (isNowCompleted) {
                req.task.finishedAt = new Date()
            }
            // Limpia finishedAt si se devuelve de completed
            if (wasCompleted) {
                req.task.finishedAt = null
            }

            req.task.completedBy.push({ user: req.user.id, status })
            await req.task.save()
            res.send('Estado actualizado correctamente')
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar el estado' })
        }
    }

    // Cambia la fase CRISP-DM de una tarea (drag & drop entre tarjetas de fase)
    static updatePhase = async (req: Request, res: Response) => {
        try {
            const { phase } = req.body
            req.task.phase = phase
            await req.task.save()
            res.send('Fase actualizada correctamente')
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar la fase' })
        }
    }

    // Marca/desmarca tarea como completada (checkbox independiente)
    static toggleCompleted = async (req: Request, res: Response) => {
        try {
            req.task.completed = !req.task.completed
            await req.task.save()
            res.send(req.task.completed ? 'Tarea marcada como completada' : 'Tarea reabierta')
        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar el estado de completado' })
        }
    }

    // Reasigna una tarea a otro usuario o la deja sin asignar
    static reassignTask = async (req: Request, res: Response) => {
        try {
            const { assignedTo } = req.body
            req.task.assignedTo = (assignedTo && assignedTo !== '') ? assignedTo : null
            await req.task.save()
            const populatedTask = await req.task.populate('assignedTo', 'name email _id')
            res.json({ 
                message: 'Tarea reasignada correctamente',
                task: populatedTask 
            })
        } catch (error) {
            res.status(500).json({ error: 'Error al reasignar la tarea' })
        }
    }
}
