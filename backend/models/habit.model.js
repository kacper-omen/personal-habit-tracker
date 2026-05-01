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
            required: [true, "Name is required"],
        },
        description: {
            type: String,
            required: [true, "Description is required"],
        },
        category: {
            type: String,
            enum: ["Sport", "Health", "Entertainment", "Other"],
            required: [true, "Category is required"],
        },
        frequencyChangesHistory: [{
            frequency: {
                type: String,
                enum: ["once", "daily", "weekly"],
                required: [true, "Frequency is required"],
            },
            from: {
                type: Date,
            },
            daysOfWeek: {
                type: [String],
            },
        }],
        startDay: {
            type: Date,
        },
        listOfDays: {
            type: [Date],
        },
    }
)

const Habit = mongoose.model("Habit", habitSchema)

export default Habit