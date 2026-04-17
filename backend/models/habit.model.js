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
        },
        startDay: {
            type: Date,
            required: [
                function () {
                    return this.frequency !== "once"
                },
                "Start date is required"
            ]
        },
        listOfDays: {
            type: [Date],
            validate: {
                validator: function (v) {
                    const frequency = this.get('frequency')
                    if (frequency === 'once') {
                        return Array.isArray(v) && v.length > 0
                    }
                    return true
                },
                message: "List of days is required",
            }
        },
    }
)

habitSchema.pre('save', function () {
    if (this.frequency === 'once') {
        this.startDay = undefined
        this.daysOfWeek = undefined
    }
    else if (this.frequency === 'daily') {
        this.listOfDays = undefined
        this.daysOfWeek = undefined
    }
    else {
        this.listOfDays = undefined
    }
})

const Habit = mongoose.model("Habit", habitSchema)

export default Habit