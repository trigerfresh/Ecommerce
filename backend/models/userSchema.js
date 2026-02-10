import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  tokens: [
    {
      token: {
        type: String,
      },
    },
  ],
})

userSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY)

    this.tokens = this.tokens.concat([{ token: token }])
    await this.save()
    return token
  } catch (error) {
    console.error(error)
  }
}

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    try {
      this.password = await bcrypt.hash(this.password, 12)
    } catch (err) {
      console.error(err)
    }
  }
  next()
})

const User = mongoose.model('User', userSchema)
export default User
