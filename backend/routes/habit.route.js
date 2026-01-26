import express from 'express'
import { createHabit, getHabits } from '../controllers/habit.controller.js'

const habitRouter = express.Router()

habitRouter.post("/", createHabit)
habitRouter.get("/", getHabits)

export default habitRouter