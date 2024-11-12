const mongoose = require("mongoose");

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
          status: String,
          message: String,
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TestCase", testCaseSchema);
