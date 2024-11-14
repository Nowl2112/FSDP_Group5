const mongoose = require("mongoose"); // Add this line to import mongoose

const testCaseSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    fileName: { type: String, required: true },
    testResults: {
      name: String,
      tests: String,
      failures: String,
      errors: String,
      skipped: String,
      testcases: [
        {
          name: String,
          browserType: String,
          status: String,
          message: String,
          time: String,
          summary: String, // Include summary here in each test case
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TestCase", testCaseSchema);
