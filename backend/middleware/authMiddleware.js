import jwt from 'jsonwebtoken'

const requireAuth = (req, res, next) => {
    const token = req.cookies?.token

    if (!token) {
        return res.status(401).json({message: "Access denied - User must be logged in"})
    }

    jwt.verify(token, process.env.JWT_SECRET, {}, (error, user) => {
        if (error) {
            return res.status(401).json({message: "Invalid token"})
        }

        req.user = user
        next()
    })
}

export default requireAuth