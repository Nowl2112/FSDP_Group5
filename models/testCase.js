// models/TestCase.js

const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  results: {
    success: { type: Boolean, required: true },
    summary: { type: String, required: true },
    details: {
      total: { type: Number, required: true },
      failures: { type: Number, required: true },
      errors: { type: Number, required: true },
      skipped: { type: Number, required: true },
    },
    failureDetails: [{ test: String, line: String, message: String }],
  },
});

const TestCase = mongoose.model('TestCase', testCaseSchema);
module.exports = TestCase;
