import express from 'express'
import { createHabit, getHabits, getHabit, deleteHabit } from '../controllers/habit.controller.js'

const habitRouter = express.Router()

habitRouter.post("/", createHabit)
habitRouter.get("/", getHabits)
habitRouter.get("/:id", getHabit)
habitRouter.delete("/:id", deleteHabit)

export default habitRouter