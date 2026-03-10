import HabitCompletion from "../models/habitCompletion.model.js";
import Habit from "../models/habit.model.js";

const markHabitAsCompleted = async (req, res) => {
    try {
        const {date, habitID} = req.body

        const habit = await Habit.findOne({_id: habitID, userID: req.user._id})

        if (!habit) {
            return res.status(404).json({message: "Habit not found"})
        }

        const completionDate = new Date(date)
        completionDate.setHours(0, 0, 0, 0)

        const habitCompletion = await HabitCompletion.create({userID: req.user._id, habitID: habit._id, date: completionDate})
        return res.status(200).json(habitCompletion)
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({message: "Habit already marked as done that day"})
        }
        return res.status(500).json({message: "Server error"})
    }
}

const markHabitAsNotDone = async (req, res) => {
    try {
        const {date, habitID} = req.body

        const habit = await Habit.findOne({_id: habitID, userID: req.user._id})

        if (!habit) {
            return res.status(404).json({message: "Habit not found"})
        }

        const startOfDay = new Date(date)
        startOfDay.setHours(0, 0, 0, 0)

        const endOfDay = new Date(date)
        endOfDay.setHours(23, 59, 59, 999)

        const deletedCompletion = await HabitCompletion.findOneAndDelete({userID: req.user._id, habitID: habit._id, date: {$gte: startOfDay, $lte: endOfDay}})
        
        if (!deletedCompletion) {
            return res.status(404).json({message: "Habit is already marked as not done"})
        }
        
        return res.status(200).json({message: "Habit marked as not done successfully"})
    } catch (error) {
        return res.status(500).json({message: "Server error", error})
    }
}

const getHabitCompletionsForDate = async (req, res) => {
    try {
        const {date} = req.body

        const startOfDay = new Date(date)
        startOfDay.setHours(0, 0, 0, 0)

        const endOfDay = new Date(date)
        endOfDay.setHours(23, 59, 59, 999)

        const habitCompletions = await HabitCompletion.find({userID: req.user._id, date: {$gte: startOfDay, $lte: endOfDay}})

        return res.status(200).json(habitCompletions)
    } catch (error) {
        return res.status(500).json({message: "Server error", error})
    }
}

const getSingleHabitCompletionForMonth = async (req, res) => {
    try {
        const {date} = req.body
        const {id} = req.params

        const month = new Date(date).getMonth()
        const year = new Date(date).getFullYear()
        const start = new Date(year, month, 1)
        const end = new Date(year, month + 1, 0)

        const habitCompletions = await HabitCompletion.find({userID: req.user._id, habitID: id, date: {$gte: start, $lte: end}})

        if (!habitCompletions) {
            return res.status(404).json({message: "No habit was completed"})
        }

        return res.status(200).json(habitCompletions)
    } catch (error) {
        return res.status(500).json({message: "Server error", error})
    }
}

export {markHabitAsCompleted, markHabitAsNotDone, getHabitCompletionsForDate, getSingleHabitCompletionForMonth}