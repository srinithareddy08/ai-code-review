const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  result: {
    type: Object,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Analysis", analysisSchema);