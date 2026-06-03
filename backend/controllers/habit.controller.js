import Habit from '../models/habit.model.js'
import HabitCompletion from '../models/habitCompletion.model.js'

const createHabit = async (req, res) => {
    try {
        const {name, frequency, daysOfWeek, category, description, startDay, listOfDays} = req.body
        
        const data = {name, category, description, userID: req.user._id}

        if (frequency === "once" && (!listOfDays || listOfDays.length === 0)) {
            return res.status(404).json({message: "List of days is required"})
        }

        if (frequency !== "once" && !startDay) {
            return res.status(404).json({message: "Start date is required"})
        }

        if (frequency === "weekly" && (!daysOfWeek || daysOfWeek.length === 0)) {
            return res.status(400).json({message: "Days of week are required"})
        }
        
        data.frequencyChangesHistory = []
        if (frequency === 'once') {
            data.listOfDays = listOfDays.map(day => new Date(day).toISOString())
            data.frequencyChangesHistory.push({
                frequency
            })
        }
        else if (frequency === 'weekly') {
            data.startDay = new Date(startDay).toISOString()
            data.frequencyChangesHistory.push({
                frequency,
                from: data.startDay,
                daysOfWeek
            })
        }
        else {
            data.startDay = new Date(startDay).toISOString()
            data.frequencyChangesHistory.push({
                frequency,
                from: data.startDay
            })
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

        await HabitCompletion.deleteMany({habitID: id})
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

        const {frequency, daysOfWeek} = req.body
        const from = new Date(req.body.from).setHours(0, 0, 0, 0)

        if (frequency === "weekly" && (!daysOfWeek || daysOfWeek.length === 0)) {
            return res.status(400).json({message: "Days of week are required"})
        }

        if (habit.frequencyChangesHistory[0].frequency !== 'once' && frequency === 'once') {
            return res.status(404).json({message: "You can't change frequency to once"})
        }
        if (habit.frequencyChangesHistory[0].frequency === "once" && frequency !== "once") {
            return res.status(404).json({message: "You can't change frequency from once"})
        }

        const updates = {...req.body}
        
        const lastIndex = habit.frequencyChangesHistory[habit.frequencyChangesHistory.length - 1]
        const secondLastIndex = habit.frequencyChangesHistory.length >= 2 ? habit.frequencyChangesHistory[habit.frequencyChangesHistory.length - 2] : undefined

        const checkDate = () => {
            return new Date(from).getTime() === new Date(lastIndex.from).getTime()
        }
        const isArrayEqual = (array1, array2) => {
            if (array1.length !== array2.length) {
                return false
            }

            return array1.every((val, i) => val === array2[i])
        }

        // Can't change frequency in the past
        if (new Date(from).getTime() >= new Date(lastIndex.from).getTime()) {
            // Delete last frequency if it is exactly the same as previous one after update
            if (((frequency === 'daily' && secondLastIndex?.frequency === 'daily') || (frequency === 'weekly' && secondLastIndex?.frequency === 'weekly' && isArrayEqual(daysOfWeek, secondLastIndex?.daysOfWeek))) && checkDate()) {
                console.log("Delete last frequency if it is exactly the same as previous one after update")
                updates.$set = {
                    frequencyChangesHistory: habit.frequencyChangesHistory.slice(0, -1)
                }
                await HabitCompletion.deleteMany({userID: req.user._id, habitID: id, date: {$gte: new Date(from)}})
            }
            // Change last frequency if updated same day
            else if (frequency !== lastIndex.frequency && checkDate()) {
                console.log("Change last frequency if updated same day")
                if (frequency === "weekly") {
                    updates.$set = {
                        [`frequencyChangesHistory.${habit.frequencyChangesHistory.length - 1}.frequency`]: frequency,
                        [`frequencyChangesHistory.${habit.frequencyChangesHistory.length - 1}.daysOfWeek`]: daysOfWeek
                    }
                }
                else if (frequency === "daily") {
                    updates.$set = {
                        [`frequencyChangesHistory.${habit.frequencyChangesHistory.length - 1}.frequency`]: frequency,
                        [`frequencyChangesHistory.${habit.frequencyChangesHistory.length - 1}.daysOfWeek`]: []
                    }
                }
                await HabitCompletion.deleteMany({userID: req.user._id, habitID: id, date: {$gte: new Date(from)}})
            }

            // Update days of week if updated the same day
            else if (frequency === "weekly" && "weekly" === lastIndex.frequency && !isArrayEqual(daysOfWeek, lastIndex.daysOfWeek) && checkDate()) {
                console.log("Update days of week if updated the same day")
                updates.$set = {
                    [`frequencyChangesHistory.${habit.frequencyChangesHistory.length - 1}.daysOfWeek`]: daysOfWeek
                }
                await HabitCompletion.deleteMany({userID: req.user._id, habitID: id, date: {$gte: new Date(from)}})
            }
      
            // Add new frequency
            else if ((frequency !== lastIndex.frequency && !checkDate()) || (frequency === "weekly" && !isArrayEqual(daysOfWeek, lastIndex.daysOfWeek) && !checkDate())) {
                console.log("Add new freuqency")
                if (frequency === "weekly") {
                    updates.$push = {
                        frequencyChangesHistory: {
                            frequency: frequency,
                            from: from,
                            daysOfWeek: daysOfWeek
                        }
                    }
                }
                else {
                    updates.$push = {
                        frequencyChangesHistory: {
                            frequency: frequency,
                            from: from,
                            daysOfWeek: []
                        }
                    }
                }
                await HabitCompletion.deleteMany({userID: req.user._id, habitID: id, date: {$gte: new Date(from)}})
            }   
        }
        
        const updatedHabit = await Habit.findOneAndUpdate({_id: id, userID: req.user._id}, updates, {new: true, runValidators: true})
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
        const habitCompletionsDesc = [...habitCompletions].sort((a, b) => new Date(b.date) - new Date(a.date)).filter(h => h.date <= today)

        const habit = await Habit.findOne({_id: id})

        // Total completions
        const totalCompletions = habitCompletions.length

        // Completion rate
        const habitsCompletedAfterToday = await HabitCompletion.countDocuments({habitID: id, date: {$gt: today}, userID: req.user._id})    
        
        let numberOfDays = 0
        // weekly/daily
        for (let i = 0; i < habit.frequencyChangesHistory.length; i++) {
            if (habit.frequencyChangesHistory[i].frequency === 'daily') { 
                const time = habit.frequencyChangesHistory[i + 1]?.from.getTime() ?? today.getTime()
                numberOfDays += Math.max(0, Math.ceil((time - habit.frequencyChangesHistory[i].from.getTime()) / (1000 * 60 * 60 * 24)) + (habit.frequencyChangesHistory[i + 1] ? 0 : 1))
            }
            else if (habit.frequencyChangesHistory[i].frequency === 'weekly' && today.getTime() >= habit.frequencyChangesHistory[i].from.getTime()) {
                const currentDay = new Date(habit.frequencyChangesHistory[i + 1]?.from ?? today)
                habit.frequencyChangesHistory[i].from.getTime() !== today.getTime() && currentDay.setDate(currentDay.getDate() - 1)
                while (currentDay.getTime() >= habit.frequencyChangesHistory[i].from.getTime()) {
                    if (habit.frequencyChangesHistory[i].daysOfWeek.includes(currentDay.toLocaleDateString("en-us", {weekday: "short"}))) {
                        numberOfDays++
                    }
                    currentDay.setDate(currentDay.getDate() - 1)
                }
            }
        }
        // once
        if (habit.frequencyChangesHistory[0].frequency === 'once') {
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
        // MAX/CURRENT STREAK

        // Max streak variables
        let maxStreak = 0
        let streak = 1
        
        // Habit Completions filter function
        const filteredHabitCompletions = (index) => {
            const currentFrequencyFrom = habit.frequencyChangesHistory[index].from.getTime()
            const nextFrequencyFrom = habit.frequencyChangesHistory[index + 1]?.from.getTime()

            return habitCompletions.filter(h => {
                return nextFrequencyFrom
                    ? h.date.getTime() >= currentFrequencyFrom && h.date.getTime() < nextFrequencyFrom
                    : h.date.getTime() >= currentFrequencyFrom && h.date.getTime() <= today.getTime()
            })
        }
        
        if (habit.frequencyChangesHistory[0].frequency !== "once") {
            for (let i = 0; i < habit.frequencyChangesHistory.length; i++) {
                // Function to get first date possible to complete for weekly frequency
                const getClosestPossibleDayForWeekly = (i) => {
                    const startDate = new Date(habit.frequencyChangesHistory[i].from)
                    
                    while (!habit.frequencyChangesHistory[i].daysOfWeek.includes(startDate.toLocaleDateString("en-us", {weekday: "short"}))) {
                        startDate.setDate(startDate.getDate() + 1)
                    }

                    const expectedDate = startDate
                    return expectedDate                    
                }
                // Function to get last date possible to complete for weekly frequency
                const getLastPossibleDayForWeekly = (i) => {
                    const startDate = new Date(habit.frequencyChangesHistory[i + 1].from)
                    startDate.setDate(startDate.getDate() - 1)

                    while (!habit.frequencyChangesHistory[i].daysOfWeek.includes(startDate.toLocaleDateString("en-us", {weekday: "short"}))) {
                        startDate.setDate(startDate.getDate() - 1)
                    }

                    const expectedDate = startDate
                    return expectedDate                    
                }

                if (filteredHabitCompletions(i).length === 0) {
                    streak = 1
                }

                // DAILY
                if (habit.frequencyChangesHistory[i].frequency === 'daily' && filteredHabitCompletions(i).length > 0) {
                    // MAXIMUM STREAK
                    if (new Date(habit.frequencyChangesHistory[i].from).getTime() !== filteredHabitCompletions(i)[0].date.getTime()) {
                        streak = 1
                    }
                    if (i !== 0 && filteredHabitCompletions(i - 1).length > 0 && getLastPossibleDayForWeekly(i - 1).getTime() === filteredHabitCompletions(i - 1).at(-1).date.getTime() && filteredHabitCompletions(i)[0].date.getTime() === habit.frequencyChangesHistory[i].from.getTime()) {            
                        streak++
                    }
                    for (let index = 0; index < filteredHabitCompletions(i).length - 1; index++) {
                        const diff = Math.ceil((new Date(filteredHabitCompletions(i)[index + 1].date) - new Date(filteredHabitCompletions(i)[index].date)) / (1000 * 60 * 60 * 24))
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
                    if (streak > maxStreak && filteredHabitCompletions(i).length !== 0) {
                        maxStreak = streak
                    }
                    if (habit.frequencyChangesHistory[i + 1] && filteredHabitCompletions(i).at(-1).date.getTime() !== new Date(habit.frequencyChangesHistory[i + 1].from).getTime() - (1000 * 60 * 60 * 24)) {
                        streak = 1
                    }
                }       
                
                // WEEKLY
                if (habit.frequencyChangesHistory[i].frequency === 'weekly' && filteredHabitCompletions(i).length > 0) {
                    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
                    let differences = []
                    const indexes = []
                    for (let index = 0; index < 7; index++) {
                        if (weekDays.includes(habit.frequencyChangesHistory[i].daysOfWeek[index])) {
                            indexes.push(weekDays.indexOf(habit.frequencyChangesHistory[i].daysOfWeek[index]))
                        }                
                    }

                    if (indexes[indexes.length - 1] === 6) {
                        differences.push(indexes[0] + 1)
                    }
                    else {
                        differences.push(7 - indexes[indexes.length - 1] + indexes[0]) 
                    }
                    
                    for (let index = indexes.length - 1; index > 0; index--) {
                        differences.push(indexes[index] - indexes[index - 1])
                    }        

                    // MAXIMUM STREAK
                    if (getClosestPossibleDayForWeekly(i).getTime() !== filteredHabitCompletions(i)[0].date.getTime()) {
                        streak = 1
                    }
                    if (i !== 0 && filteredHabitCompletions(i - 1).length > 0 && habit.frequencyChangesHistory[i - 1].frequency === 'daily' && new Date(habit.frequencyChangesHistory[i].from).getTime() - (1000 * 60 * 60 * 24) === filteredHabitCompletions(i - 1).at(-1).date.getTime() && getClosestPossibleDayForWeekly(i).getTime() === filteredHabitCompletions(i)[0].date.getTime()) {
                        streak++
                    }     
                    else if (i !== 0 && filteredHabitCompletions(i - 1).length > 0 && habit.frequencyChangesHistory[i - 1].frequency === 'weekly' && getLastPossibleDayForWeekly(i - 1).getTime() === filteredHabitCompletions(i - 1).at(-1).date.getTime() && getClosestPossibleDayForWeekly(i).getTime() === filteredHabitCompletions(i)[0].date.getTime()) {
                        streak++
                    }        
                    for (let index = 0; index < filteredHabitCompletions(i).length - 1; index++) {
                        const diff = Math.ceil((new Date(filteredHabitCompletions(i)[index + 1].date) - new Date(filteredHabitCompletions(i)[index].date)) / (1000 * 60 * 60 * 24))
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
                    if (streak > maxStreak && filteredHabitCompletions(i).length !== 0) {
                        maxStreak = streak
                    }
                    if (habit.frequencyChangesHistory[i + 1] && filteredHabitCompletions(i).at(-1).date.getTime() !== getLastPossibleDayForWeekly(i).getTime()) {
                        streak = 1
                    }
                }
            }
            
            // CURRENT STREAK
            const frequencyDesc = habit.frequencyChangesHistory.toReversed()
            let currentStreak = 0

            // Function to get habit completions for single frequency
            const filteredHabitComDesc = (index) => {        
                const currentFrequencyFrom = frequencyDesc[index].from.getTime()
                const nextFrequencyFrom = frequencyDesc[index - 1]?.from.getTime()

                return habitCompletionsDesc.filter(h => {
                    return nextFrequencyFrom
                        ? h.date.getTime() >= currentFrequencyFrom && h.date.getTime() < nextFrequencyFrom
                        : h.date.getTime() >= currentFrequencyFrom && h.date.getTime() <= today.getTime()
                })
            }
            
            frequencyHistory: for (let i = 0; i < frequencyDesc.length; i++) {
                // DAILY
                if (frequencyDesc[i].frequency === 'daily') {
                    if (i !== 0 && frequencyDesc[i - 1].from.getTime() - (1000 * 60 * 60 * 24) !== filteredHabitComDesc(i)[0]?.date.getTime()) {
                        break
                    }
                    else if (i !== 0 && filteredHabitComDesc(i).length === 1 && frequencyDesc[i - 1].from.getTime() - (1000 * 60 * 60 * 24) === filteredHabitComDesc(i)[0].date.getTime()) {
                        currentStreak++
                    }     

                    for (let index = 0; index < filteredHabitComDesc(i).length - 1; index++) {
                        if (i === 0 && !filteredHabitComDesc(0).some((h) => h.date.getTime() === today.getTime() || h.date.getTime() === today.getTime() - (1000 * 60 * 60 * 24))) {
                            break frequencyHistory
                        }
                        const diff = Math.ceil((new Date(filteredHabitComDesc(i)[index].date - filteredHabitComDesc(i)[index + 1].date)) / (1000 * 60 * 60 * 24))
                        currentStreak++
                        if (diff !== 1 && !(filteredHabitComDesc(i)[index].date > today)) {
                            break frequencyHistory;
                        }     
                        if (filteredHabitComDesc(i)[index].date > today) {
                            currentStreak = 0
                        }
                        if (index === filteredHabitComDesc(i).length - 2) {
                            currentStreak++
                        }
                    }
                    if (filteredHabitComDesc(i).length === 1 && (filteredHabitComDesc(i)[0].date.getTime() === today.getTime() || filteredHabitComDesc(i)[0].date.getTime() === today.getTime() - (1000 * 60 * 60 * 24))) {
                        currentStreak = 1
                    }
                    if (filteredHabitComDesc(i).at(-1)?.date.getTime() !== frequencyDesc[i].from.getTime()) {
                        break
                    }
                    
                }
                
                // WEEKLY
                if (frequencyDesc[i].frequency === 'weekly') {
                    let closestDay = new Date(today)
                    let secondClosestDay
                    if (i === 0) {             
                        while (true) {
                            if (frequencyDesc[0].daysOfWeek.includes(closestDay.toLocaleDateString("en-us", {weekday: "short"}))) {
                                secondClosestDay = new Date(closestDay)
                                while (true) {
                                    secondClosestDay.setDate(secondClosestDay.getDate() - 1)
                                    if (frequencyDesc[0].daysOfWeek.includes(secondClosestDay.toLocaleDateString("en-us", {weekday: "short"}))) {
                                        break
                                    }
                                }
                                break
                            }
                            closestDay.setDate(closestDay.getDate() - 1)
                        }
                    }

                    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
                    let differences = []
                    const indexes = []
                    for (let index = 0; index < 7; index++) {
                        if (weekDays.includes(frequencyDesc[i].daysOfWeek[index])) {
                            indexes.push(weekDays.indexOf(frequencyDesc[i].daysOfWeek[index]))
                        }                
                    }
                    if (indexes[indexes.length - 1] === 6) {
                        differences.push(indexes[0] + 1)
                    }
                    else {
                        differences.push(7 - indexes[indexes.length - 1] + indexes[0]) 
                    }          
                    for (let index = indexes.length - 1; index > 0; index--) {
                        differences.push(indexes[index] - indexes[index - 1])
                    }        
                    
                    // Function to get first date possible to complete for weekly frequency
                    const getClosestPossibleDayForWeekly = (i) => {
                        const startDate = new Date(frequencyDesc[i].from)
                        
                        while (!frequencyDesc[i].daysOfWeek.includes(startDate.toLocaleDateString("en-us", {weekday: "short"}))) {
                            startDate.setDate(startDate.getDate() + 1)
                        }

                        const expectedDate = startDate
                        return expectedDate                    
                    }
                    // Function to get last date possible to complete for weekly frequency
                    const getLastPossibleDayForWeekly = (i) => {
                        const startDate = new Date(frequencyDesc[i - 1].from)
                        startDate.setDate(startDate.getDate() - 1)

                        while (!frequencyDesc[i].daysOfWeek.includes(startDate.toLocaleDateString("en-us", {weekday: "short"}))) {
                            startDate.setDate(startDate.getDate() - 1)
                        }

                        const expectedDate = startDate
                        return expectedDate                    
                    }
                    
                    if (i !== 0 && getLastPossibleDayForWeekly(i).getTime() !== filteredHabitComDesc(i)[0]?.date.getTime()) {
                        break
                    }
                    else if (i !== 0 && filteredHabitComDesc(i).length === 1 && getLastPossibleDayForWeekly(i).getTime() === filteredHabitComDesc(i)[0]?.date.getTime()) {
                        currentStreak++
                    }      

                    for (let index = 0; index < filteredHabitComDesc(i).length - 1; index++) {  
                        if (i === 0) {
                            if (!filteredHabitComDesc(0).some((h => h.date.getTime() === closestDay.getTime() || h.date.getTime() === secondClosestDay.getTime()))) {
                                break frequencyHistory
                            }
                            if (!filteredHabitComDesc(0).some(h => h.date.getTime() === closestDay.getTime() && closestDay.getTime() < today.getTime()) && closestDay.getTime() !== today.getTime()) {
                                break frequencyHistory
                            }
                        }
                        
                        const diff = Math.ceil((new Date(filteredHabitComDesc(i)[index].date) - new Date(filteredHabitComDesc(i)[index + 1].date)) / (1000 * 60 * 60 * 24))
                        currentStreak++
                        if (!differences.includes(diff) && filteredHabitComDesc(i)[index].date <= today) {
                            break frequencyHistory;
                        }
                        else if (filteredHabitComDesc(i)[index].date > today) {
                            currentStreak = 0
                        }     
                        
                        if (index === filteredHabitComDesc(i).length - 2) {
                            currentStreak++
                        }
                    }
                    if (getClosestPossibleDayForWeekly(i).getTime() !== filteredHabitComDesc(i).at(-1)?.date.getTime() && getClosestPossibleDayForWeekly(i).getTime() < today.getTime()) {
                        break
                    }           
                    if (filteredHabitComDesc(i).length === 1 && i === 0 && (filteredHabitComDesc(i)[0].date.getTime() === closestDay.getTime() || (filteredHabitComDesc(i)[0].date.getTime() === secondClosestDay.getTime() && closestDay.getTime() === today.getTime()))) {
                        currentStreak = 1
                    }               
                }         
            }
        }
        
        // ONCE
        console.log("checkpoint1")
        if (habit.frequencyChangesHistory[0].frequency === 'once' && habitCompletionsDesc.length > 0) {
            // MAXIMUM STREAK
            console.log("checkpoint2")
            streak = 0
            habit.listOfDays = [...habit.listOfDays].sort((a, b) => new Date(b) - new Date(a))
            habit.listOfDays = habit.listOfDays.filter(day => day <= today)
            let j = 0
            console.log("checkpoint3")
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
            console.log("checkpoint4")
            // CURRENT STREAK
            const filteredLodArray = habit.listOfDays.filter(date => date.getTime() <= today.getTime())
            console.log("checkpoint5")
            if (habitCompletionsDesc[0].date.getTime() === today.getTime() || filteredLodArray[0].getTime() !== today.getTime()) {
                console.log("checkpoint x1")
                console.log(habitCompletionsDesc)
                for (let i = 0; i < habitCompletionsDesc.length; i++) {
                    console.log("checkpoint x2")
                    if (habitCompletionsDesc[i].date.getTime() !== filteredLodArray[i].getTime()) {
                        console.log("checkpoint x3")
                        break
                    }
                    console.log("checkpoint x4")
                    currentStreak++
                }
                console.log("checkpoint y1")
            }
            else {
                console.log("checkpoint x5")
                for (let i = 0; i < habitCompletionsDesc.length; i++) {
                    console.log("checkpoint x6")
                    if (habitCompletionsDesc[i].date.getTime() !== filteredLodArray[i + 1].getTime()) {
                        console.log("checkpoint x7")
                        break
                    }
                    console.log("checkpoint x8")
                    currentStreak++
                }
                console.log("checkpoint x9")
            }    
            console.log("checkpoint6")
            if (streak > maxStreak && habitCompletions.length !== 0) {
                maxStreak = streak
            }
            console.log("checkpoint7")
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