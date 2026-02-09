import mongoose from "mongoose";

const habitSchema = mongoose.Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
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
        frequency: {
            type: String,
            enum: ["once", "daily", "weekly"],
            required: [true, "Frequency is required"],
        },
        daysOfWeek: {
            type: [String],
            validate: {
                validator: function (v) {
                    const frequency = this.get('frequency')
                    if (frequency === 'weekly') {
                        return Array.isArray(v) && v.length > 0
                    }
                    return true
                },
                message: "Days of week are required",
            },
        }
    }
)

const Habit = mongoose.model("Habit", habitSchema)

export default Habit