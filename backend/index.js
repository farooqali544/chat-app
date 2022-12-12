const express = require('express')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')
app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  )
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')

  next()
})

const usersRoute = require('./routes/users')
const conversationRoute = require('./routes/conversations');
const messagesRoute = require('./routes/messages');
const contactsRoute = require('./routes/contacts');

app.use('/users', usersRoute)
app.use('/conversations', conversationRoute )
app.use('/messages', messagesRoute)
app.use('/contacts', contactsRoute)

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({ message: error.message || 'An unkown error occured' })
})


try {
  mongoose.connect('mongodb://localhost:27017/chat-app').then(() => {
    console.log('connected')
    app.listen(5000)
  })
} catch (e) {
  console.log('could not connect')
}
