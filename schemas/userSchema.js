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
  image: {
    type: String,
    default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png'
  },
  messages: {
    type: Number,
    default: 0,
  }
})

module.exports = mongoose.model('type12users-full-projects', userSchema)