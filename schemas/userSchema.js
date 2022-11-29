const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  hashedPsw: {
    type: String,
    required: true
  },
  secret: {
    type: String,
    required: true,
  },
  messages: {
    type: Number,
  }
})

module.exports = mongoose.model('type12users-full-projects', userSchema)