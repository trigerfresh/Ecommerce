import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDb from './config/db.js'
import router from './routes/router.js'
import cookieParser from 'cookie-parser'
import { adminLogin } from './controllers/adminLogin.js'

const app = express()

dotenv.config()

app.use(express.json())
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
)
app.use(cookieParser())
app.use('/uploads', express.static('uploads'))

app.use('/api', router)
app.use('/api/admin', adminLogin)

const PORT = process.env.PORT

app.listen(PORT, () => {
  connectDb()
  console.log(`Server running at ${PORT}`)
})
