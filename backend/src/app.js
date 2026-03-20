import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import apiRoutes from './routes/index.js'

dotenv.config()

const app = express()

const origin = process.env.CLIENT_ORIGIN || 'http://localhost:5173'
app.use(cors({ origin }))
app.use(express.json())

app.use('/api', apiRoutes)

app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' })
})

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.statusCode || 500
  res.status(status).json({ message: err.message || 'Internal Server Error' })
})

export default app

