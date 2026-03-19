import { Router } from 'express'
import { body, param } from 'express-validator'
import { ProjectController } from '../controllers/ProjectController'
import { handleInputErrors } from '../middleware/validation'
import { TaskController } from '../controllers/TaskController'
import { TraceabilityController } from '../controllers/TraceabilityController'
import { ReportController } from '../controllers/ReportController'
import { projectExists } from '../middleware/project'
import { hasAuthorization, taskBelongsToProject, taskExists } from '../middleware/task'
import { authenticate } from '../middleware/auth'
import { TeamMemberController } from '../controllers/TeamController'
import { NoteController } from '../controllers/NoteController'

const router = Router()
router.use(authenticate)

router.post('/',
    body('projectName').notEmpty().withMessage('El Nombre del Proyecto es Obligatorio'),
    body('clientName').notEmpty().withMessage('El Nombre del Cliente es Obligatorio'),
    body('description').notEmpty().withMessage('La Descripción del Proyecto es Obligatoria'),
    handleInputErrors,
    ProjectController.createProject
)
router.get('/', ProjectController.getAllProjects)
router.get('/:id',
    param('id').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    ProjectController.getProjectById
)

router.param('projectId', projectExists)

router.put('/:projectId',
    param('projectId').isMongoId().withMessage('ID no válido'),
    body('projectName').notEmpty().withMessage('El Nombre del Proyecto es Obligatorio'),
    body('clientName').notEmpty().withMessage('El Nombre del Cliente es Obligatorio'),
    body('description').notEmpty().withMessage('La Descripción del Proyecto es Obligatoria'),
    handleInputErrors,
    hasAuthorization,
    ProjectController.updateProject
)
router.delete('/:projectId',
    param('projectId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    hasAuthorization,
    ProjectController.deleteProject
)

// Tasks
router.post('/:projectId/tasks',
    hasAuthorization,
    body('name').notEmpty().withMessage('El Nombre de la tarea es Obligatorio'),
    body('description').notEmpty().withMessage('La descripción de la tarea es obligatoria'),
    body('phase')
        .notEmpty().withMessage('La fase CRISP-DM es obligatoria')
        .isIn(['business', 'data_understanding', 'data_preparation', 'modeling', 'evaluation', 'deployment'])
        .withMessage('Fase no válida'),
    body('status').optional()
        .isIn(['pending', 'onHold', 'inProgress', 'underReview', 'completed'])
        .withMessage('Estado no válido'),
    body('assignedTo').optional({ nullable: true })
        .custom((value) => !value || value === '' || /^[a-fA-F0-9]{24}$/.test(value))
        .withMessage('ID de colaborador no válido'),
    handleInputErrors,
    TaskController.createTask
)
router.get('/:projectId/tasks', TaskController.getProjectTasks)

router.param('taskId', taskExists)
router.param('taskId', taskBelongsToProject)

router.get('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    TaskController.getTaskById
)
router.put('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('ID no válido'),
    body('name').notEmpty().withMessage('El Nombre de la tarea es Obligatorio'),
    body('description').notEmpty().withMessage('La descripción de la tarea es obligatoria'),
    body('assignedTo').optional({ nullable: true })
        .custom((value) => !value || value === '' || /^[a-fA-F0-9]{24}$/.test(value))
        .withMessage('ID de colaborador no válido'),
    handleInputErrors,
    TaskController.updateTask
)
router.delete('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    TaskController.deleteTask
)
router.post('/:projectId/tasks/:taskId/status',
    param('taskId').isMongoId().withMessage('ID no válido'),
    body('status').notEmpty().withMessage('El estado es obligatorio'),
    handleInputErrors,
    TaskController.updateStatus
)
router.patch('/:projectId/tasks/:taskId/phase',
    param('taskId').isMongoId().withMessage('ID no válido'),
    body('phase').notEmpty().withMessage('La fase es obligatoria')
        .isIn(['business', 'data_understanding', 'data_preparation', 'modeling', 'evaluation', 'deployment'])
        .withMessage('Fase no válida'),
    handleInputErrors,
    TaskController.updatePhase
)
router.patch('/:projectId/tasks/:taskId/completed',
    param('taskId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    TaskController.toggleCompleted
)

// Trazabilidad — Datasets
router.post('/:projectId/datasets',
    body('name').notEmpty().withMessage('El nombre es obligatorio'),
    body('source').notEmpty().withMessage('La fuente es obligatoria'),
    body('description').notEmpty().withMessage('La descripción es obligatoria'),
    body('acquisitionDate').notEmpty().withMessage('La fecha es obligatoria'),
    body('phase').notEmpty().withMessage('La fase es obligatoria'),
    handleInputErrors,
    TraceabilityController.createDataset
)
router.get('/:projectId/datasets', TraceabilityController.getDatasets)
router.delete('/:projectId/datasets/:datasetId',
    param('datasetId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    TraceabilityController.deleteDataset
)

// Trazabilidad — Experimentos
router.post('/:projectId/experiments',
    body('name').notEmpty().withMessage('El nombre es obligatorio'),
    body('model').notEmpty().withMessage('El modelo es obligatorio'),
    body('parameters').notEmpty().withMessage('Los parámetros son obligatorios'),
    body('metric').notEmpty().withMessage('La métrica es obligatoria'),
    body('result').notEmpty().withMessage('El resultado es obligatorio'),
    body('conclusion').notEmpty().withMessage('La conclusión es obligatoria'),
    body('phase').notEmpty().withMessage('La fase es obligatoria'),
    handleInputErrors,
    TraceabilityController.createExperiment
)
router.get('/:projectId/experiments', TraceabilityController.getExperiments)
router.delete('/:projectId/experiments/:experimentId',
    param('experimentId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    TraceabilityController.deleteExperiment
)

// Trazabilidad — Decisiones
router.post('/:projectId/decisions',
    body('description').notEmpty().withMessage('La descripción es obligatoria'),
    body('justification').notEmpty().withMessage('La justificación es obligatoria'),
    body('phase').notEmpty().withMessage('La fase es obligatoria'),
    handleInputErrors,
    TraceabilityController.createDecision
)
router.get('/:projectId/decisions', TraceabilityController.getDecisions)
router.delete('/:projectId/decisions/:decisionId',
    param('decisionId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    TraceabilityController.deleteDecision
)

// Reporte
router.get('/:projectId/report', ReportController.getProjectReport)

// Team
router.post('/:projectId/team/find',
    body('email').isEmail().toLowerCase().withMessage('E-mail no válido'),
    handleInputErrors,
    TeamMemberController.findMemberByEmail
)
router.get('/:projectId/team', TeamMemberController.getProjecTeam)
router.post('/:projectId/team',
    body('id').isMongoId().withMessage('ID No válido'),
    handleInputErrors,
    TeamMemberController.addMemberById
)
router.delete('/:projectId/team/:userId',
    param('userId').isMongoId().withMessage('ID No válido'),
    handleInputErrors,
    TeamMemberController.removeMemberById
)

// Notes
router.post('/:projectId/tasks/:taskId/notes',
    body('content').notEmpty().withMessage('El Contenido de la nota es obligatorio'),
    handleInputErrors,
    NoteController.createNote
)
router.get('/:projectId/tasks/:taskId/notes', NoteController.getTaskNotes)
router.delete('/:projectId/tasks/:taskId/notes/:noteId',
    param('noteId').isMongoId().withMessage('ID No Válido'),
    handleInputErrors,
    NoteController.deleteNote
)

export default router
