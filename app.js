const express = require('express')
require('dotenv').config()
const moment = require('moment')
const router = require('./src/routes/router')
const cors = require('cors')
const { CORS_ALLOWED_ORIGIN, PORT } = process.env

const app = express()

app.use(
  express.urlencoded({
    extended: true
  })
)
app.use(express.json())

app.use(
  cors({
    origin: CORS_ALLOWED_ORIGIN.split(','),
    credentials: true
  })
)

app.use('/api/v1', router)

app.use((req, res) => {
  res.status(404)
  res.send({
    success: true,
    message: 'Not Found'
  })
})

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.message = err.message || 'Internal Server Error'
  res.status(err.statusCode).json({
    message: err.message
  })
})

module.exports = app.listen(PORT, (req, res) => {
  console.log(moment().format('DD-MM-YYYY HH:mm:ss'))
  console.log(`server running at | ${PORT}`)
})
