const mongoose = require('mongoose')

const {
   GroupMessageSchema,
   GroupSchema,
   UserSchema,
   UserSchema2,
} = require('../schema/schema')

const User = mongoose.model('User', UserSchema)
const User2 = mongoose.model('User2', UserSchema2)
const Group = mongoose.model('Group', GroupSchema)
const GroupMess = mongoose.model('GroupMess', GroupMessageSchema)

const addUser = (req, res) => {
   let newUser = new User(req.body)

   newUser.save((err, user) => {
      if (err) {
         res.send(err)
      }
      res.json(user)
   })
}

const addUser2 = async (req, res) => {
   let newUser = new User2(req.body)
   newUser.save((err, user) => {
      if (err) {
         res.send(err)
      }
      res.json(user)
   })
}

const getUsers = (req, res) => {
   User.find({}, (err, user) => {
      if (err) {
         res.send(err)
      }
      res.json(user)
   })
}

const getUsers2 = (req, res) => {
   User2.find({}, (err, user) => {
      if (err) {
         res.send(err)
      }
      res.json(user)
   })
}

const getUser = (req, res) => {
   User.findById(req.params.userId, (err, user) => {
      if (err) {
         res.send(err)
      }
      res.json(user)
   })
}

const updateUser = (req, res) => {
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

const removeUser = (req, res) => {
   User.deleteOne({ _id: req.params.userId }, (err, user) => {
      if (err) {
         res.send(err)
      }
      res.json({ message: 'successfuly remove the user' })
   })
}

const newGroup = (req, res) => {
   let newGroup = new Group(req.body)

   newGroup.save((err, group) => {
      if (err) {
         res.send(err)
      }
      res.json(group)
   })
}

const updateGroup = (req, res) => {
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

const getGroup = (req, res) => {
   Group.find({}, (err, group) => {
      if (err) {
         res.send(err)
      }
      res.json(group)
   })
}

const newMessage = (req, res) => {
   let GM = new GroupMess(req.body)

   GM.save((err, mess) => {
      if (err) {
         res.send(err)
      }
      res.json(mess)
   })
}

const getGroupMess = (req, res) => {
   GroupMess.find({}, (err, mess) => {
      if (err) {
         res.send(err)
      }
      res.json(mess)
   })
}

module.exports = {
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
}
