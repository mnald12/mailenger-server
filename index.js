const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')

const {
   addUser,
   getUser,
   getUsers,
   updateUser,
   removeUser,
   addUser2,
   newGroup,
   getGroup,
   getGroupMess,
   newMessage,
   updateGroup,
} = require('./methods/methods.js')

const { sendMessage } = require('./methods/sendMessage.js')
const { getMessages } = require('./methods/getMessages.js')
const { getGroupMessages } = require('./methods/getGroupMessages.js')
const { login } = require('./methods/login.js')

const http = require('http')
const app = express()
const PORT = 9000

const server = http.createServer(app)
const io = require('socket.io')(server, {
   cors: {
      origin: '*',
      methods: ['GET', 'POST'],
   },
})

let connected = []

io.on('connection', (socket) => {
   socket.on('save-user', (id, email) => {
      connected.push({
         id: id,
         email: email,
      })
   })

   socket.on('get-id', (email, passID) => {
      for (let i = 0; i < connected.length; i++) {
         if (connected[i].email === email) {
            passID(connected[i].id)
            break
         } else {
            if (i === connected.length - 1) {
               passID(false)
            }
         }
      }
   })

   socket.on('get-start', (email, id, callerId, mode) => {
      io.to(id).emit('calling', email, callerId, mode)
   })

   socket.on('is-ready', (id) => {
      io.to(id).emit('ready')
   })

   socket.on('send-offer', (id, offer) => {
      io.to(id).emit('offer', offer)
   })

   socket.on('send-answer', (id, localDescription) => {
      io.to(id).emit('answer', localDescription)
   })

   socket.on('send-candidate', (id, candidate) => {
      io.to(id).emit('candidate', candidate)
   })

   socket.on('reject-call', (caller) => {
      console.log('call is call')
      io.to(caller).emit('reject')
   })

   socket.on('abort-call', (callee) => {
      io.to(callee).emit('aborted')
   })

   socket.on('end-call', (id) => {
      io.to(id).emit('close2')
   })

   socket.on('end-call2', (id) => {
      io.to(id).emit('close')
   })

   socket.on('send-email', (data) => {
      const reciever = connected.find((c) => data.to === c.email)
      if (reciever) {
         io.to(reciever.id).emit('recieve-email', data)
      }
   })

   socket.on('send-group-email', (data) => {
      const reciever = connected.find((c) => data.sendTo === c.email)
      if (reciever) {
         io.to(reciever.id).emit('recieve-group-email', data)
      }
   })

   socket.on('disconnect', () => {
      const newConnected = connected.filter(
         ({ id: id, emaill: email }) => id !== socket.id
      )
      connected = newConnected
   })
})

mongoose.set('strictQuery', true)
mongoose.Promise = global.Promise

mongoose.connect(
   'mongodb+srv://mnald12:sawadasa12@base1.5j0tmkm.mongodb.net/users',
   {
      useNewUrlParser: true,
   }
)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'build')))

app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, 'build/index.html'))
})

app.route('/user/:email/:pwd/:host/:port').get(login)
app.route('/users').get(getUsers).post(addUser)
app.route('/users2').post(addUser2)
app.route('/users2/:email/:pwd/:host/:port/:init/:end').get(getMessages)
app.route('/send').post(sendMessage)
app.route('/users/:userId').get(getUser).put(updateUser).delete(removeUser)
app.route('/group').get(getGroup).post(newGroup)
app.route('/group/:GID').put(updateGroup)
app.route('/group/messages').get(getGroupMess).post(newMessage)
app.route('/group/messages/:email/:pwd/:host/:port').get(getGroupMessages)
server.listen(PORT, () => console.log(`running on port ${PORT}`))
