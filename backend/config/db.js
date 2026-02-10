import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.mongo_uri)
    console.log('Database connected successful')
  } catch (err) {
    console.error(err.message)
  }
}

export default connectDb
