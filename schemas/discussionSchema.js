const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const discussionSchema = new Schema({
  discussion: {
    type: String,
    required: true,
  },
  topics: {
    type: Array
  }
})

module.exports = mongoose.model('type12discussions-full-projects', discussionSchema)