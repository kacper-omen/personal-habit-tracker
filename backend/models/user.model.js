import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            unique: true,
            minLength: [3, "Name must have at least 3 characters"],
            trim: true,
            set: v => v.replace(/ /g, ""),
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
            set: v => v.replace(/ /g, ""),
            validate: {
                validator: function(v) {
                    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v)
                },
                message: props => `${props.value} is not a valid email`,
            },
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            trim: true,
            set: v => v.replace(/ /g, ""),
            validate: {
                validator: function(v) {
                    return /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\-]).{8,}$/.test(v)
                },
                message: "Password must have at least 8 characters, 1 uppercase letter, and 1 special character",
            },
        }
    }
)

userSchema.pre("save", async function() {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model("User", userSchema)

export default User