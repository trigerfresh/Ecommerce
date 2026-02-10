import User from '../models/userSchema.js'

export const adminGetUsers = async (req, res) => {
  try {
    const users = await User.find(
      { role: { $ne: 'admin' } },
      { password: 0, tokens: 0 },
    )
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const adminDeleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id)
  res.json({ message: 'User deleted' })
}

export const adminUpdateUser = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, req.body)
  res.json({ message: 'User updated' })
}

export const adminCreate = async (req, res) => {
  try {
    const { fname, lname, phone, email, password, gender } = req.body

    const existing = await User.findOne({ phone })
    if (existing)
      return res.status(400).json({ message: 'User already exists' })

    const user = new User({
      fname,
      lname,
      phone,
      email,
      password, // will be hashed automatically in userSchema pre-save hook
      gender,
      role: 'admin',
    })

    await user.save()
    res.status(201).json({ message: 'Admin created successfully', user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
