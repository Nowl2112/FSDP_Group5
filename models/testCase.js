// models/testCase.js
const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema({
  userEmail: String,
  fileName: String,
  testResults: {
    success: Boolean,
    summary: String,
    details: {
      total: Number,
      failures: Number,
      errors: Number,
      skipped: Number,
    },
    failureDetails: [
      {
        test: String,
        line: String,
        message: String,
      },
    ],
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TestCase", testCaseSchema);
