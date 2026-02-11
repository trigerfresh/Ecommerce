import express from 'express'
import bcrypt from 'bcrypt'
import User from '../models/userSchema.js'

export const adminLogin = async (req, res) => {
  try {
    const { phone, password } = req.body

    const user = await User.findOne({ phone })
    if (!user) {
      return res
        .status(401)
        .json({ isLogin: false, message: 'Invalid phone or password' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ isLogin: false, message: 'Invalid phone or password' })
    }

    if (user.role !== 'admin') {
      return res
        .status(403)
        .json({ isLogin: false, message: 'You are not an admin' })
    }

    const token = await user.generateAuthToken()

    res.json({
      isLogin: true,
      token,
      user: {
        _id: user._id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        role: user.role,
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ isLogin: false, message: 'Server error' })
  }
}
