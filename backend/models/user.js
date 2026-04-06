const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  timestamps: true,
  email: {
    type: String,
    required: true,
    match: /^\S+@\S+\.\S+$/,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false // ✅ FIX: Don't return password by default when querying users
  }
});

module.exports = mongoose.model("User", UserSchema);