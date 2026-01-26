import express from 'express'
import { createHabit, getHabits, getHabit, deleteHabit, updateHabit } from '../controllers/habit.controller.js'

const habitRouter = express.Router()

habitRouter.post("/", createHabit)
habitRouter.get("/", getHabits)
habitRouter.get("/:id", getHabit)
habitRouter.delete("/:id", deleteHabit)
habitRouter.put("/:id", updateHabit)

export default habitRouter