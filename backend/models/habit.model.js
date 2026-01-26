import mongoose from "mongoose";

const habitSchema = mongoose.Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        frequency: {
            type: String,
            enum: ["once", "daily", "weekly"],
            required: true,
        },
        daysOfWeek: {
            type: [String],
            required: false,
        }
    }
)

const Habit = mongoose.model("Habit", habitSchema)

export default Habit