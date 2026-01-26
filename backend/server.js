import express from 'express'
import dotenv from 'dotenv'
import connectDB from './db.js'
import habitRouter from './routes/habit.route.js'

dotenv.config()

const app = express()
app.use(express.json())

app.use("/api/habits", habitRouter)

connectDB()

const PORT = process.env.PORT || 5000

app.get("/", (req, res) => {
    res.json("Welcome in Personal Habit Tracker API")
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})