import mongoose from 'mongoose'
import { UserSchema, UserSchema2 } from '../schema/schema'

var Imap = require('imap'),
   inspect = require('util').inspect

const User = mongoose.model('User', UserSchema)
const User2 = mongoose.model('User2', UserSchema2)

export const addUser = (req, res) => {
   let newUser = new User(req.body)

   newUser.save((err, user) => {
      if (err) {
         res.send(err)
      }
      res.json(user)
   })
}

export const addUser2 = async (req, res) => {
   let newUser = new User2(req.body)
   newUser.save((err, user) => {
      if (err) {
         res.send(err)
      }
      res.json(user)
   })
}

export const getUsers = (req, res) => {
   User.find({}, (err, user) => {
      if (err) {
         res.send(err)
      }
      res.json(user)
   })
}

export const getUsers2 = (req, res) => {
   User2.find({}, (err, user) => {
      if (err) {
         res.send(err)
      }
      res.json(user)
   })
}

export const getUser = (req, res) => {
   User.findById(req.params.userId, (err, user) => {
      if (err) {
         res.send(err)
      }
      res.json(user)
   })
}

export const updateUser = (req, res) => {
   User.findOneAndUpdate(
      { _id: req.params.userId },
      req.body,
      { new: true, useFindAndModify: false },
      (err, user) => {
         if (err) {
            res.send(err)
         }
         res.json(user)
      }
   )
}

export const removeUser = (req, res) => {
   User.deleteOne({ _id: req.params.userId }, (err, user) => {
      if (err) {
         res.send(err)
      }
      res.json({ message: 'successfuly remove the user' })
   })
}

export const getMessages = (req, res) => {
   const imap = new Imap({
      user: req.params.email,
      password: req.params.pwd,
      host: req.params.host,
      port: req.params.port,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
   })

   let messages = []

   function openInbox(cb) {
      imap.openBox('INBOX', true, cb)
   }

   imap.once('ready', function () {
      openInbox(function (err, box) {
         if (err) throw err
         var f = imap.seq.fetch('1:*', {
            bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
            struct: true,
         })
         f.on('message', function (msg, seqno) {
            msg.on('body', function (stream, info) {
               let buffer = ''

               stream.on('data', function (chunk) {
                  buffer += chunk.toString('utf8')
               })

               stream.once('end', function () {
                  messages.push(Imap.parseHeader(buffer))
               })
            })
         })
         f.once('error', function (err) {
            console.log('Fetch error: ' + err)
         })
         f.once('end', function () {
            console.log('Done fetching all messages!')
            imap.end()
         })
      })
   })

   imap.once('error', function (err) {
      console.log(err)
   })

   imap.once('end', function () {
      console.log('Connection ended')
      res.json(messages)
   })

   imap.connect()
}
