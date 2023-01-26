import mongoose from 'mongoose'

const Schema = mongoose.Schema

export const UserSchema = new Schema({
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

export const UserSchema2 = new Schema({
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

export const GroupSchema = new Schema({
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

export const GroupMessageSchema = new Schema({
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
