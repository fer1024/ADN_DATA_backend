import type { Request, Response } from 'express'
import Project from '../models/Project'
import Task from '../models/Task'
import Phase from '../models/Phase'
import Dataset from '../models/Dataset'
import Experiment from '../models/Experiment'
import Decision from '../models/Decision'
import Note from '../models/Note'

export class ProjectController {

    static createProject = async (req: Request, res: Response) => {
        const project = new Project(req.body)
        project.manager = req.user.id
        try {
            await project.save()
            const crispPhases = [
                "Business Understanding",
                "Data Understanding",
                "Data Preparation",
                "Modeling",
                "Evaluation",
                "Deployment"
            ]
            for (let i = 0; i < crispPhases.length; i++) {
                await Phase.create({ name: crispPhases[i], order: i, project: project._id })
            }
            res.send('Proyecto Creado Correctamente')
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al crear el proyecto' })
        }
    }

    static getAllProjects = async (req: Request, res: Response) => {
        try {
            const projects = await Project.find({
                $or: [
                    { manager: { $in: req.user.id } },
                    { team: { $in: req.user.id } }
                ]
            })
            res.json(projects)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al obtener proyectos' })
        }
    }

    static getProjectById = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            const project = await Project.findById(id).populate('tasks')
            if (!project) {
                return res.status(404).json({ error: 'Proyecto no encontrado' })
            }
            if (project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id)) {
                return res.status(403).json({ error: 'Acción no válida' })
            }
            res.json(project)
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al obtener el proyecto' })
        }
    }

    static updateProject = async (req: Request, res: Response) => {
        try {
            req.project.clientName = req.body.clientName
            req.project.projectName = req.body.projectName
            req.project.description = req.body.description
            await req.project.save()
            res.send('Proyecto Actualizado')
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al actualizar el proyecto' })
        }
    }

    static deleteProject = async (req: Request, res: Response) => {
        try {
            const projectId = req.project._id

            // Obtener todas las tareas para eliminar sus notas
            const tasks = await Task.find({ project: projectId })
            const taskIds = tasks.map(t => t._id)

            // Eliminar en cascada todo lo relacionado al proyecto
            await Promise.all([
                Note.deleteMany({ task: { $in: taskIds } }),       // notas de tareas
                Task.deleteMany({ project: projectId }),            // tareas
                Phase.deleteMany({ project: projectId }),           // fases
                Dataset.deleteMany({ project: projectId }),         // datasets
                Experiment.deleteMany({ project: projectId }),      // experimentos
                Decision.deleteMany({ project: projectId }),        // decisiones
            ])

            // Finalmente eliminar el proyecto
            await req.project.deleteOne()

            res.send('Proyecto eliminado correctamente')
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Error al eliminar el proyecto' })
        }
    }
}