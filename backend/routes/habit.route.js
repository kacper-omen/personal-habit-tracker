import express from 'express'
import { createHabit, getHabits, getHabit, deleteHabit, updateHabit } from '../controllers/habit.controller.js'
import { markHabitAsCompleted, getHabitCompletionsForDate, markHabitAsNotDone, getSingleHabitCompletionForMonth, getSingleHabitCompletionForDate } from '../controllers/habitCompletion.controller.js'
import requireAuth from '../middleware/authMiddleware.js'

const habitRouter = express.Router()

habitRouter.post("/", requireAuth, createHabit)
habitRouter.get("/", requireAuth, getHabits)
habitRouter.get("/:id", requireAuth, getHabit)
habitRouter.delete("/:id", requireAuth, deleteHabit) // TO DO - delete habit completions
habitRouter.put("/:id", requireAuth, updateHabit)

// Habit Completion
habitRouter.post("/completions", requireAuth, markHabitAsCompleted)
habitRouter.post("/completions/check", requireAuth, getHabitCompletionsForDate)
habitRouter.post("/completions/check/single/:id", requireAuth, getSingleHabitCompletionForDate)
habitRouter.post("/completions/check/:id", requireAuth, getSingleHabitCompletionForMonth)
habitRouter.delete("/completions/delete", requireAuth, markHabitAsNotDone)

export default habitRouter