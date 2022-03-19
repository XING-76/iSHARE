const mongoose = require("mongoose");

const pinSchema = new mongoose.Schema({
  id: { type: String },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  destinationLink: {
    type: String,
    default: "none"
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  category: {
    type: String,
    required: true
  },
  imgUrl: {
    type: String
  },
  // saved user id
  saved: {
    type: [String],
    default: []
  },
  // save { commenterId, comment }
  comments: {
    type: [Object],
    default: []
  }
})


module.exports = mongoose.model("Pin", pinSchema);