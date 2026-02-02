import User from '../models/user.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const register = async (req, res) => {
    try {
        const {name, email, password} = req.body
        
        if (!name) {
            return res.status(400).json({message: "name is required"})
        }
        if (!email) {
            return res.status(400).json({message: "email is required"})
        }
        if (!password) {
            return res.status(400).json({message: "password is required"})
        }

        const existingUser = await User.findOne({$or: [{name}, {email}]})

        if (!existingUser) {
            const saltRounds = 10
            const hashedPassword = await bcrypt.hash(password, saltRounds)
            const user = await User.create({name, email, password: hashedPassword})
            return res.status(200).json(user)
        }

        return res.status(409).json({message: "User already exists"})
    } catch (error) {
        return res.status(500).json({message: `Server error: ${error}`})
    }
}

const login = async (req, res) => {
    try {
        const {email, password} = req.body

        if (!email) {
            return res.status(400).json({message: "Email is required"})
        }
        if (!password) {
            return res.status(400).json({message: "Password is required"})
        }

        const user = await User.findOne({email})
        if (!user) {
            return res.status(401).json({message: "Wrong email or password"})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({message: "Wrong email or password"})
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000,
        })

        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({message: `Server error: ${error}`})
    }
}

const logout = async (req, res) => {
    try {
        const token = req.cookies?.token

        if (token && jwt.verify(token, process.env.JWT_SECRET)) {
            res.clearCookie("token", {
                httpOnly: true,
                maxAge: 3 * 24 * 60 * 60 * 1000,
            })

            return res.status(200).json({message: "Logged out successfully"})
        }

        return res.status(401).json({message: "User is already logged out"})
    } catch (error) {
        return res.status(500).json({message: `Server error: ${error}`})
    }
}

export {register, login, logout}