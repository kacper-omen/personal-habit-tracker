import express from 'express'
import dotenv from 'dotenv'
import connectDB from './db.js'

dotenv.config()

const app = express()

connectDB()

const PORT = process.env.PORT || 5000

app.get("/", (req, res) => {
    res.json("Welcome in Personal Habit Tracker API")
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})