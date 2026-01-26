import User from '../models/user.model.js'

const register = async (req, res) => {
    try {
        const {name, email, password} = req.body
        if (!name) {
            return res.status(400).json({message: "name is required"})
        }
        if (!email) {
            return res.status(400).json({message: "name is required"})
        }
        if (!password) {
            return res.status(400).json({message: "name is required"})
        }

        const user = await User.create(req.body)
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({message: `Server error: ${error}`})
    }
}

export {register}