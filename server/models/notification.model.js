
//dont need now will used in future
import mongoose from 'mongoose'

const notificationSchema=new mongoose.Schema({
 userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index:true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['analysis', 'interview', 'reminder', 'system']
  },
  isRead: {
    type: Boolean,
    default: false
  },
  link: {
    type: String,    
    default: null       
  }


},{timestamps:true})

export const Notification= mongoose.model('Notification', notificationSchema)