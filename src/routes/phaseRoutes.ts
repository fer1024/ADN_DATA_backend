import express from "express"
import Phase from "../models/Phase"

const router = express.Router()

// Obtener fases por proyecto
router.get("/:projectId", async (req, res) => {
  try {
    const phases = await Phase.find({ project: req.params.projectId })
    res.json(phases)
  } catch (error) {
    res.status(500).json({ error: "Error al obtener fases" })
  }
})

export default router