import bcrypt from 'bcrypt'
import User from '../models/userSchema.js'

/* ================= SIGNUP ================= */
export const signup = async (req, res) => {
  try {
    const user = new User(req.body)

    await user.save()
    const token = await user.generateAuthToken()

    res.status(201).json({
      isComplete: true,
      token,
      user: {
        _id: user._id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
      },
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      isComplete: false,
      message: 'Invalid data',
    })
  }
}

/* ================= CHECK PHONE ================= */
export const isExistPhone = async (req, res) => {
  try {
    const { phone } = req.body
    const user = await User.findOne({ phone })

    res.status(200).json({
      isExist: !!user,
    })
  } catch (err) {
    res.status(400).json({
      message: 'Could not understand request',
    })
  }
}

/* ================= AUTHENTICATION ================= */
/* 🔐 Protected route – auth middleware REQUIRED */
export const authentication = async (req, res) => {
  try {
    const user = await User.findById(req.user._id, {
      password: 0,
      tokens: 0,
    })

    if (!user) {
      return res.status(401).json({
        isAuthenticate: false,
      })
    }

    res.status(200).json({
      isAuthenticate: true,
      user,
    })
  } catch (err) {
    res.status(401).json({
      isAuthenticate: false,
    })
  }
}

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    const { phone, password } = req.body

    const user = await User.findOne({ phone })
    if (!user) {
      return res.status(401).json({
        isLogin: false,
        message: 'Invalid phone or password',
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({
        isLogin: false,
        message: 'Invalid phone or password',
      })
    }

    const token = await user.generateAuthToken()

    res.status(200).json({
      isLogin: true,
      token,
      user: {
        _id: user._id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
      },
    })
  } catch (err) {
    res.status(500).json({
      isLogin: false,
    })
  }
}

/* ================= LOGIN WITH PHONE ================= */
export const loginWithMobileNumber = async (req, res) => {
  try {
    const { phone } = req.body
    const user = await User.findOne({ phone })

    if (!user) {
      return res.status(401).json({ isLogin: false })
    }

    const token = await user.generateAuthToken()

    res.status(200).json({
      isLogin: true,
      token,
      user: {
        _id: user._id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        phone: user.phone,
      },
    })
  } catch (err) {
    res.status(500).json({ isLogin: false })
  }
}

/* ================= LOGOUT ================= */
/* 🔐 Protected route */
export const logout = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    user.tokens = user.tokens.filter((t) => t.token !== req.token)

    await user.save()

    res.status(200).json({
      isLogout: true,
    })
  } catch (err) {
    res.status(500).json({
      isLogout: false,
    })
  }
}

/* ================= UPDATE USER INFO ================= */
/* 🔐 Protected route */
export const updateUserInfo = async (req, res) => {
  try {
    const { fname, lname, gender } = req.body

    await User.updateOne({ _id: req.user._id }, { fname, lname, gender })

    res.status(200).json({
      isUpdated: true,
    })
  } catch (err) {
    res.status(500).json({
      isUpdated: false,
    })
  }
}

/* ================= UPDATE EMAIL ================= */
/* 🔐 Protected route */
export const updateEmail = async (req, res) => {
  try {
    const { email } = req.body

    await User.updateOne({ _id: req.user._id }, { email })

    res.status(200).json({
      isUpdated: true,
    })
  } catch (err) {
    res.status(500).json({
      isUpdated: false,
    })
  }
}
