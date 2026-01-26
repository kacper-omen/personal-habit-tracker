import express from 'express'
import { createHabit, getHabits, getHabit } from '../controllers/habit.controller.js'

const habitRouter = express.Router()

habitRouter.post("/", createHabit)
habitRouter.get("/", getHabits)
habitRouter.get("/:id", getHabit)

export default habitRouter