import mongoose from "mongoose";

const habitCompletionSchema = mongoose.Schema(
    {
        habitID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Habit",
            required: true,
        },
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        date: {
            type: Date,
            required: true,
        }
    }
)

const HabitCompletion = mongoose.model("HabitCompletion", habitCompletionSchema)

export default HabitCompletion