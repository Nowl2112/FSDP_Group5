const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  results: {
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
});

const TestCase = mongoose.model("TestCase", testCaseSchema);
module.exports = TestCase;
