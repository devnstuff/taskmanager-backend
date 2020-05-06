const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    required: [true, 'Please enter your e-mail address'],
    unique: true
  },
  name: {
    type: String,
    trim: true,
    required: [true, 'Please enter your name'],
    unique: true
  },
  password: {
    type: String,
    trim: true,
    required: [true, 'Please enter your password, min 9 characters']
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model('user', UserSchema);
