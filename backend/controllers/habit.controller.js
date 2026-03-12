import Habit from '../models/habit.model.js'
import HabitCompletion from '../models/habitCompletion.model.js'

const createHabit = async (req, res) => {
    try {
        const {name, frequency, category, description, daysOfWeek, startDay} = req.body

        const start = new Date(startDay)
        start.setHours(0, 0, 0, 0)

        const habit = await Habit.create({name, frequency, category, description, daysOfWeek, startDay: start.toISOString(), userID: req.user._id})
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

const getHabitStats = async (req, res) => {
    try {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const {id} = req.params

        const habitCompletions = await HabitCompletion.find({habitID: id, userID: req.user._id})

        const totalCompletions = habitCompletions.length

        const habitsCompletedAfterToday = await HabitCompletion.countDocuments({habitID: id, date: {$gt: today}, userID: req.user._id})    

        const habit = await Habit.findOne({_id: id})
        
        let numberOfDays = 0
        if (habit.frequency === 'daily') {   
            numberOfDays = Math.max(0, (today - habit.startDay) / (1000 * 60 * 60 * 24) + 1)
        }
        else if (habit.frequency === 'weekly' && today >= habit.startDay) {
            let currentDay = new Date()
            currentDay.setHours(0, 0, 0, 0)
           
            while (currentDay >= habit.startDay) {
                if (habit.daysOfWeek.includes(currentDay.toLocaleDateString("en-us", {weekday: "short"}))) {
                    numberOfDays++
                }
                currentDay.setDate(currentDay.getDate() - 1)
            }
        }
        numberOfDays += habitsCompletedAfterToday

        const percentageCompletions = ((totalCompletions / numberOfDays) * 100).toFixed(2)

        return res.status(200).json({
            totalCompletions: totalCompletions,
            percentageCompletions: percentageCompletions,
        })
    } catch (error) {
        return res.status(500).json({message: `Server error: ${error}`})
    }
}

export {createHabit, getHabits, getHabit, deleteHabit, updateHabit, getHabitStats}