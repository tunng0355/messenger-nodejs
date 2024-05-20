const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Table = new Schema({    
    status: {
        type: String,
    },
},{ timestamps: true });

module.exports = mongoose.model('Chat', Table);