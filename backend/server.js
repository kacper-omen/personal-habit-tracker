import express from 'express'
import dotenv from 'dotenv'
import connectDB from './db.js'
import habitRouter from './routes/habit.route.js'
import authRouter from './routes/auth.route.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

dotenv.config()

const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))

app.use("/api/habits", habitRouter)
app.use("/api/auth", authRouter)

connectDB()

const PORT = process.env.PORT || 5000

app.get("/", (req, res) => {
    res.json("Welcome in Personal Habit Tracker API")
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})