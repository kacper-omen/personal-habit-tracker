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

        const habitCompletions = await HabitCompletion.find({habitID: id, userID: req.user._id}).sort({date: 1})
        const habitCompletionsDesc = [...habitCompletions].sort((a, b) => new Date(b.date) - new Date(a.date))

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

        // Max streak
        let maxStreak = 0
        let streak = 1
        // daily
        if (habit.frequency === 'daily') {
            for (let index = 0; index < habitCompletions.length - 1; index++) {
                const diff = (new Date(habitCompletions[index + 1].date) - new Date(habitCompletions[index].date)) / (1000 * 60 * 60 * 24)
                if (diff === 1) {
                    streak++
                }
                else {
                    if (streak > maxStreak) {
                        maxStreak = streak
                    }
                    streak = 1
                }
            }
        }       
        
        // weekly
        if (habit.frequency === 'weekly') {
            const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
            let differences = []
            const indexes = []
            for (let index = 0; index < 7; index++) {
                if (weekDays.includes(habit.daysOfWeek[index])) {
                    indexes.push(weekDays.indexOf(habit.daysOfWeek[index]))
                }                
            }

            differences.push(7 - indexes[indexes.length - 1])
            for (let index = indexes.length - 1; index > 0; index--) {
                differences.push(indexes[index] - indexes[index - 1])
            }        

            for (let index = 0; index < habitCompletions.length - 1; index++) {
                const diff = Math.ceil((new Date(habitCompletions[index + 1].date) - new Date(habitCompletions[index].date)) / (1000 * 60 * 60 * 24))
                if (differences.includes(diff)) {
                    streak++
                }   
                else {
                    if (streak > maxStreak) {
                        maxStreak = streak
                    }
                    streak = 1
                }
            }
        }
        if (streak > maxStreak && habitCompletions.length !== 0) {
            maxStreak = streak
        }

        // Current streak
        let currentStreak = 0
        for (let index = 0; index < habitCompletionsDesc.length - 1; index++) {
            if (!habitCompletionsDesc.some((h) => h.date.getTime() === today.getTime() || h.date.getTime() === today.getTime() - (1000 * 60 * 60 * 24))) {
                break
            }
            const diff = (new Date(habitCompletionsDesc[index].date - habitCompletionsDesc[index + 1].date)) / (1000 * 60 * 60 * 24)
            currentStreak++
            if (diff !== 1 && !(habitCompletionsDesc[index].date > today)) {
                break;
            }     
            if (diff !== 1 && habitCompletionsDesc[index].date > today) {
                currentStreak = 0
            }
        }

        return res.status(200).json({
            totalCompletions: totalCompletions,
            percentageCompletions: percentageCompletions,
            maxStreak: maxStreak,
            currentStreak: currentStreak,
        })
    } catch (error) {
        return res.status(500).json({message: `Server error: ${error}`})
    }
}

export {createHabit, getHabits, getHabit, deleteHabit, updateHabit, getHabitStats}