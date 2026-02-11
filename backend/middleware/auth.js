import jwt from 'jsonwebtoken'
import User from '../models/userSchema.js'

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    // if (!token) throw new Error()

    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    })

    // if (!user) throw new Error()
    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    req.token = token
    req.user = user
    next()
  } catch {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

export default auth
