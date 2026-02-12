import express from 'express'
import { createHabit, getHabits, getHabit, deleteHabit, updateHabit } from '../controllers/habit.controller.js'
import requireAuth from '../middleware/authMiddleware.js'

const habitRouter = express.Router()

habitRouter.post("/", requireAuth, createHabit)
habitRouter.get("/", requireAuth, getHabits)
habitRouter.get("/:id", requireAuth, getHabit)
habitRouter.delete("/:id", requireAuth, deleteHabit)
habitRouter.put("/:id", requireAuth, updateHabit)

export default habitRouter