import type { Request, Response } from 'express'
import Dataset from '../models/Dataset'
import Experiment from '../models/Experiment'
import Decision from '../models/Decision'

export class TraceabilityController {

    // ── Datasets ──────────────────────────────────────────────────────────
    static createDataset = async (req: Request, res: Response) => {
        try {
            const dataset = new Dataset({
                ...req.body,
                project: req.project.id,
                createdBy: req.user.id
            })
            await dataset.save()
            res.send('Dataset registrado correctamente')
        } catch (error) {
            res.status(500).json({ error: 'Error al registrar el dataset' })
        }
    }

    static getDatasets = async (req: Request, res: Response) => {
        try {
            const { phase } = req.query
            const filter: any = { project: req.project.id }
            if (phase) filter.phase = phase
            const datasets = await Dataset.find(filter)
                .populate('createdBy', 'name email')
                .sort({ createdAt: -1 })
            res.json(datasets)
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener datasets' })
        }
    }

    static deleteDataset = async (req: Request, res: Response) => {
        try {
            await Dataset.findByIdAndDelete(req.params.datasetId)
            res.send('Dataset eliminado correctamente')
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar el dataset' })
        }
    }

    // ── Experiments ───────────────────────────────────────────────────────
    static createExperiment = async (req: Request, res: Response) => {
        try {
            const experiment = new Experiment({
                ...req.body,
                project: req.project.id,
                createdBy: req.user.id
            })
            await experiment.save()
            res.send('Experimento registrado correctamente')
        } catch (error) {
            res.status(500).json({ error: 'Error al registrar el experimento' })
        }
    }

    static getExperiments = async (req: Request, res: Response) => {
        try {
            const { phase } = req.query
            const filter: any = { project: req.project.id }
            if (phase) filter.phase = phase
            const experiments = await Experiment.find(filter)
                .populate('createdBy', 'name email')
                .sort({ createdAt: -1 })
            res.json(experiments)
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener experimentos' })
        }
    }

    static deleteExperiment = async (req: Request, res: Response) => {
        try {
            await Experiment.findByIdAndDelete(req.params.experimentId)
            res.send('Experimento eliminado correctamente')
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar el experimento' })
        }
    }

    // ── Decisions ─────────────────────────────────────────────────────────
    static createDecision = async (req: Request, res: Response) => {
        try {
            const decision = new Decision({
                ...req.body,
                project: req.project.id,
                createdBy: req.user.id
            })
            await decision.save()
            res.send('Decisión registrada correctamente')
        } catch (error) {
            res.status(500).json({ error: 'Error al registrar la decisión' })
        }
    }

    static getDecisions = async (req: Request, res: Response) => {
        try {
            const { phase } = req.query
            const filter: any = { project: req.project.id }
            if (phase) filter.phase = phase
            const decisions = await Decision.find(filter)
                .populate('createdBy', 'name email')
                .sort({ createdAt: -1 })
            res.json(decisions)
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener decisiones' })
        }
    }

    static deleteDecision = async (req: Request, res: Response) => {
        try {
            await Decision.findByIdAndDelete(req.params.decisionId)
            res.send('Decisión eliminada correctamente')
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar la decisión' })
        }
    }
}