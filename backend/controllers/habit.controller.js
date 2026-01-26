import Habit from '../models/habit.model.js'

const createHabit = async (req, res) => {
    try {
        const {userID, name, frequency, category, description} = req.body
        if (!userID) {
            return res.status(400).json({message: "userID is required"})
        }
        if (!name) {
            return res.status(400).json({message: "name is required"})
        }
        if (!frequency) {
            return res.status(400).json({message: "frequency is required"})
        }
        if (!category) {
            return res.status(400).json({message: "category is required"})
        }
        if (!description) {
            return res.status(400).json({message: "description is required"})
        }

        const habit = await Habit.create(req.body)
        return res.status(200).json(habit)
    } catch (error) {
        return res.status(500).json({message: `Server error: ${error}`})
    }
}

const getHabits = async (req, res) => {
    try {
        const habits = await Habit.find()
        return res.status(200).json(habits)
    } catch (error) {
        return res.status(500).json({message: `Server error: ${error}`})
    }
}