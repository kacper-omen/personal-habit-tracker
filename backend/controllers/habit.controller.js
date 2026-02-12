import Habit from '../models/habit.model.js'

const createHabit = async (req, res) => {
    try {
        const {name, frequency, category, description, daysOfWeek} = req.body

        const habit = await Habit.create({name, frequency, category, description, daysOfWeek, userID: req.user._id})
        return res.status(200).json(habit)
    } catch (error) {
        if (error.name === "ValidationError") {
            const errors = Object.keys(error.errors).map((key) => ({
                field: key,
                message: error.errors[key].message,
            }))

            return res.status(400).json({errors})
        }

        return res.status(500).json({message: `Server error: ${error}`})
    }
}

const getHabits = async (req, res) => {
    try {
        const habits = await Habit.find({userID: req.user._id})
        return res.status(200).json(habits)
    } catch (error) {
        return res.status(500).json({message: `Server error: ${error}`})
    }
}

const getHabit = async (req, res) => {
    try {
        const {id} = req.params
        const habit = await Habit.findOne({_id: id, userID: req.user._id})

        if (!habit) {
            return res.status(404).json({message: "Habit not found"})
        }

        return res.status(200).json(habit)
    } catch (error) {
        return res.status(500).json({message: `Server error: ${error}`})
    }
}

const deleteHabit = async (req, res) => {
    try {
        const {id} = req.params
        const habit = await Habit.findOne({_id: id, userID: req.user._id})

        if (!habit) {
            return res.status(404).json({message: "Habit not found"})
        }

        await Habit.findOneAndDelete({_id: id, userID: req.user._id})
        return res.status(200).json({message: `Habit of id: ${id} deleted successfully`})
    } catch (error) {
        return res.status(500).json({message: `Server error: ${error}`})
    }
}

const updateHabit = async (req, res) => {
    try {
        const {id} = req.params
        const habit = await Habit.findOne({_id: id, userID: req.user._id})

        if (!habit) {
            return res.status(404).json({message: "Habit not found"})
        }

        const updatedHabit = await Habit.findOneAndUpdate({_id: id, userID: req.user._id}, req.body, {new: true, runValidators: true})
        return res.status(200).json(updatedHabit)
    } catch (error) {
        if (error.name === "ValidationError") {
            const errors = Object.keys(error.errors).map((key) => ({
                field: key,
                message: error.errors[key].message,
            }))

            return res.status(400).json({errors})
        }

        return res.status(500).json({message: `Server error: ${error}`})
    }
}

export {createHabit, getHabits, getHabit, deleteHabit, updateHabit}