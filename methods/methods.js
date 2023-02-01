import mongoose from 'mongoose'
import {
   GroupMessageSchema,
   GroupSchema,
   UserSchema,
   UserSchema2,
} from '../schema/schema'

const User = mongoose.model('User', UserSchema)
const User2 = mongoose.model('User2', UserSchema2)
const Group = mongoose.model('Group', GroupSchema)
const GroupMess = mongoose.model('GroupMess', GroupMessageSchema)

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

export const newGroup = (req, res) => {
   let newGroup = new Group(req.body)

   newGroup.save((err, group) => {
      if (err) {
         res.send(err)
      }
      res.json(group)
   })
}

export const updateGroup = (req, res) => {
   console.log(req.params.GID)
   Group.findOneAndUpdate(
      { _id: req.params.GID },
      req.body,
      { new: true, useFindAndModify: false },
      (err, grp) => {
         if (err) {
            res.send(err)
         }
         res.json(grp)
      }
   )
}

export const getGroup = (req, res) => {
   Group.find({}, (err, group) => {
      if (err) {
         res.send(err)
      }
      res.json(group)
   })
}

export const newMessage = (req, res) => {
   let GM = new GroupMess(req.body)

   GM.save((err, mess) => {
      if (err) {
         res.send(err)
      }
      res.json(mess)
   })
}

export const getGroupMess = (req, res) => {
   GroupMess.find({}, (err, mess) => {
      if (err) {
         res.send(err)
      }
      res.json(mess)
   })
}
