import Habit from '../models/habit.model.js'
import HabitCompletion from '../models/habitCompletion.model.js'

const createHabit = async (req, res) => {
    try {
        const {name, frequency, category, description, daysOfWeek, startDay, listOfDays} = req.body
        
        const data = {name, frequency, category, description, userID: req.user._id}

        if (frequency === 'once') {
            listOfDays.forEach(day => {
                new Date(day).setHours(0, 0, 0, 0)
            })
            data.listOfDays = listOfDays
        }
        else if (frequency === 'weekly') {
            data.daysOfWeek = daysOfWeek
            data.startDay = startDay
            const start = new Date(startDay)
            start.setHours(0, 0, 0, 0)
            data.startDay = start
        }
        else {
            data.startDay = startDay
            const start = new Date(startDay)
            start.setHours(0, 0, 0, 0)
            data.startDay = start
        }     

        const habit = await Habit.create(data)
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
            numberOfDays = Math.max(0, Math.ceil((today.getTime() - habit.startDay.getTime()) / (1000 * 60 * 60 * 24)) + 1)
        }
        else if (habit.frequency === 'weekly' && today.getTime() >= habit.startDay.getTime()) {
            let currentDay = new Date()
            currentDay.setHours(0, 0, 0, 0)
           
            while (currentDay.getTime() >= habit.startDay.getTime()) {
                if (habit.daysOfWeek.includes(currentDay.toLocaleDateString("en-us", {weekday: "short"}))) {
                    numberOfDays++
                }
                currentDay.setDate(currentDay.getDate() - 1)
            }
        }
        else if (habit.frequency === 'once') {
            habit.listOfDays.forEach(date => {
                if (date.getTime() <= today.getTime()) {
                    numberOfDays++
                }
            })
        }
        numberOfDays += habitsCompletedAfterToday
        let percentageCompletions
        if (numberOfDays === 0) {
            percentageCompletions = 0
        }
        else {
            percentageCompletions = ((totalCompletions / numberOfDays) * 100)
            percentageCompletions = Math.round(percentageCompletions * 100) / 100
        }          

        // Max streak variables
        let maxStreak = 0
        let streak = 1
        // Current streak variables
        let currentStreak = 0

        // DAILY
        if (habit.frequency === 'daily') {
            // MAXIMUM STREAK
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
            // CURRENT STREAK
            for (let index = 0; index < habitCompletionsDesc.length - 1; index++) {
                if (!habitCompletionsDesc.some((h) => h.date.getTime() === today.getTime() || h.date.getTime() === today.getTime() - (1000 * 60 * 60 * 24))) {
                    break
                }
                const diff = Math.ceil((new Date(habitCompletionsDesc[index].date - habitCompletionsDesc[index + 1].date)) / (1000 * 60 * 60 * 24))
                currentStreak++
                if (diff !== 1 && !(habitCompletionsDesc[index].date > today)) {
                    break;
                }     
                if (habitCompletionsDesc[index].date > today) {
                    currentStreak = 0
                }
                if (index === habitCompletionsDesc.length - 2) {
                    currentStreak++
                }
            }
            if (habitCompletionsDesc.length === 1 && (habitCompletionsDesc[0].date.getTime() === today.getTime() || habitCompletionsDesc[0].date.getTime() === today.getTime() - (1000 * 60 * 60 * 24))) {
                currentStreak = 1
            }
        }       
        
        // WEEKLY
        if (habit.frequency === 'weekly') {
            const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
            let differences = []
            const indexes = []
            for (let index = 0; index < 7; index++) {
                if (weekDays.includes(habit.daysOfWeek[index])) {
                    indexes.push(weekDays.indexOf(habit.daysOfWeek[index]))
                }                
            }

            if (indexes[indexes.length - 1] === 6) {
                differences.push(indexes[0] + 1)
            }
            else {
                differences.push(7 - indexes[indexes.length - 1]) 
            }
            
            for (let index = indexes.length - 1; index > 0; index--) {
                differences.push(indexes[index] - indexes[index - 1])
            }        
            // MAXIMUM STREAK
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

            // CURRENT STREAK
            let closestDay = new Date(today)
            let secondClosestDay
            while (true) {
                if (habit.daysOfWeek.includes(closestDay.toLocaleDateString("en-us", {weekday: "short"}))) {
                    secondClosestDay = new Date(closestDay)
                    while (true) {
                        secondClosestDay.setDate(secondClosestDay.getDate() - 1)
                        if (habit.daysOfWeek.includes(secondClosestDay.toLocaleDateString("en-us", {weekday: "short"}))) {
                            break
                        }
                    }
                    break
                }
                closestDay.setDate(closestDay.getDate() - 1)
            }

            for (let index = 0; index < habitCompletionsDesc.length - 1; index++) {        
                if (!habitCompletionsDesc.some((h => h.date.getTime() === closestDay.getTime() || h.date.getTime() === secondClosestDay.getTime()))) {
                    break
                }
                if (!habitCompletionsDesc.some(h => h.date.getTime() === closestDay.getTime() && closestDay.getTime() < today.getTime()) && closestDay.getTime() !== today.getTime()) {
                    break
                }

                const diff = Math.ceil((new Date(habitCompletionsDesc[index].date) - new Date(habitCompletionsDesc[index + 1].date)) / (1000 * 60 * 60 * 24))
                currentStreak++
                if (!differences.includes(diff) && habitCompletionsDesc[index].date <= today) {
                    break;
                }
                else if (habitCompletionsDesc[index].date > today) {
                    currentStreak = 0
                }     
                
                if (index === habitCompletionsDesc.length - 2) {
                    currentStreak++
                }
            }
            if (habitCompletionsDesc.length === 1 && (habitCompletionsDesc[0].date.getTime() === closestDay.getTime() || (habitCompletionsDesc[0].date.getTime() === secondClosestDay.getTime() && closestDay.getTime() === today.getTime()))) {
                currentStreak = 1
            }
        }

        // ONCE
        if (habit.frequency === 'once') {
            // MAXIMUM STREAK
            streak = 0
            habit.listOfDays = [...habit.listOfDays].sort((a, b) => new Date(b) - new Date(a))
            let j = 0
            for (let i = 0; i < habitCompletionsDesc.length; i++) {               
                if (habit.listOfDays[j].getTime() != habitCompletionsDesc[i].date.getTime()) {
                    if (streak > maxStreak) {
                        maxStreak = streak
                    }
                    streak = 1                 
                    j = habit.listOfDays.findIndex(date => date.getTime() === habitCompletionsDesc[i].date.getTime()) + 1                   
                }
                else {
                    streak++
                    j++
                }        
            }

            // CURRENT STREAK
            const filteredHabitComDesc = habitCompletionsDesc.filter(h => h.date.getTime() <= today.getTime())
            const filteredLodArray = habit.listOfDays.filter(date => date.getTime() <= today.getTime())
            
            if (filteredHabitComDesc[0].date.getTime() === today.getTime() || filteredLodArray[0].getTime() !== today.getTime()) {
                for (let i = 0; i < filteredHabitComDesc.length; i++) {
                    if (filteredHabitComDesc[i].date.getTime() !== filteredLodArray[i].getTime()) {
                        break
                    }
                    currentStreak++
                }
            }
            else {
                for (let i = 0; i < filteredHabitComDesc.length; i++) {
                    if (filteredHabitComDesc[i].date.getTime() !== filteredLodArray[i + 1].getTime()) {
                        break
                    }
                    currentStreak++
                }
            }                      
        }

        if (streak > maxStreak && habitCompletions.length !== 0) {
            maxStreak = streak
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