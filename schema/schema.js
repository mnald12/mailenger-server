const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
   userName: {
      type: String,
   },
   userId: {
      type: String,
   },
   userAvatar: {
      type: String,
   },
   userEmail: {
      type: String,
   },
})

const UserSchema2 = new Schema({
   userEmail: {
      type: String,
   },
   userPassword: {
      type: String,
   },
   userHost: {
      type: String,
   },
   userPort: {
      type: Number,
   },
})

const GroupSchema = new Schema({
   groupId: {
      type: String,
   },
   groupName: {
      type: String,
   },
   creator: {
      type: String,
   },
   members: {
      type: Array,
   },
})

const GroupMessageSchema = new Schema({
   to: {
      type: String,
   },
   from: {
      type: String,
   },
   date: {
      type: String,
   },
   message: {
      type: String,
   },
})

module.exports = { UserSchema, UserSchema2, GroupSchema, GroupMessageSchema }
