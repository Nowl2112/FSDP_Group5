// Add this to your models/dailyTest.js
const mongoose = require('mongoose');

const dailyTestSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileContent: {
    type: String,
    required: true
  },
  scheduleTime: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DailyTest', dailyTestSchema);