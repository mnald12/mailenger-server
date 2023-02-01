import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'

import {
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
} from './methods/methods'

import { sendMessage } from './methods/sendMessage'
import { getMessages } from './methods/getMessages'
import { getGroupMessages } from './methods/getGroupMessages'

const http = require('http')
const app = express()
const PORT = 9001

const server = http.createServer(app)
const io = require('socket.io')(server, {
   cors: {
      origin: '*',
      methods: ['GET', 'POST'],
   },
})

let connected = []

io.on('connection', (socket) => {
   //
   socket.emit('me', socket.id)

   socket.on('save-user', (id, email) => {
      connected.push({
         id: id,
         email: email,
      })
   })

   socket.on('get-id', (email, passID) => {
      let IDS
      for (let i of connected) {
         if (i.email === email) {
            IDS = i.id
            break
         }
      }
      passID(IDS)
   })

   socket.on('send-offer', (ownId, id, localDescription, name, mode) => {
      io.to(id).emit('offer', ownId, localDescription, name, mode)
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

server.listen(9002)

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

app.get('/', getUsers)
app.route('/users').get(getUsers).post(addUser)
app.route('/users2').post(addUser2)
app.route('/users2/:email/:pwd/:host/:port/:init/:end').get(getMessages)
app.route('/send').post(sendMessage)
app.route('/users/:userId').get(getUser).put(updateUser).delete(removeUser)
app.route('/group').get(getGroup).post(newGroup)
app.route('/group/:GID').put(updateGroup)
app.route('/group/messages').get(getGroupMess).post(newMessage)
app.route('/group/messages/:email/:pwd/:host/:port').get(getGroupMessages)
app.listen(PORT, () => console.log(`running on port ${PORT}`))
