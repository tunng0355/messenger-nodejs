const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const Friend = new Schema(
    {
      avatar: { type: String },
      name: { type: String },
      uid: { type: String },
      type:{ type: String },
      chatID:{ type: String }
    },
    { _id: false }
 );
  
const Table = new Schema({    
    avatar: {
        type: String,
    },
    fullname: {
        type: String,
    },
    username: {
        type: String,
        required: true
    },
    phone: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    DateBirth: {
        type: Number,
    },
    MonthBirth: {
        type: Number,
    },
    YearBirth: {
        type: Number,
    },
    password: {
        type: String,
        required: true 
    },
    token: {
        type: String,
    },
    friend: {
        type: [Friend],
        default: [],
    },
    online: {
        type: String,
    },
    status: {
        type: String,
    }, 
},{ timestamps: true });

module.exports = mongoose.model('users', Table);