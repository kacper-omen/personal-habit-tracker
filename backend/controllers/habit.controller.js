import Habit from '../models/habit.model.js'

const createHabit = async (req, res) => {
    try {
        const {name, frequency, category, description} = req.body
        
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

const getHabit = async (req, res) => {
    try {
        const {id} = req.params
        const habit = await Habit.findById(id)
        return res.status(200).json(habit)
    } catch (error) {
        return res.status(500).json({message: `Server error: ${error}`})
    }
}

const deleteHabit = async (req, res) => {
    try {
        const {id} = req.params
        await Habit.findByIdAndDelete(id)
        return res.status(200).json({message: `Habit of id: ${id} deleted successfully`})
    } catch (error) {
        return res.status(500).json({message: `Server error: ${error}`})
    }
}

const updateHabit = async (req, res) => {
    try {
        const {id} = req.params
        const habit = await Habit.findById(id)

        if (!habit) {
            return res.status(404).json({message: "Habit not found"})
        }

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

        const updatedHabit = await Habit.findByIdAndUpdate(id, req.body, {new: true})
        return res.status(200).json(updatedHabit)
    } catch (error) {
        return res.status(500).json({message: `Server error: ${error}`})
    }
}

export {createHabit, getHabits, getHabit, deleteHabit, updateHabit}