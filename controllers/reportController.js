const TestCase = require("../models/testCase");

// Create a new test case
const createTestCase = async (req, res) => {
  try {
    const { userEmail, results } = req.body;

    if (!userEmail || !results) {
      return res.status(400).json({ message: "Missing userEmail or results" });
    }

    const newTestCase = new TestCase({
      userEmail,
      testResults: {
        ...results,
        testcases: results.testcases.map((testCase) => ({
          name: testCase.name,
          browserType: testCase.browserType,
          status: testCase.status,
          time: testCase.time,
          message: testCase.message || "",
          summary: testCase.summary, // Ensure summary is included here
        })),
      },
    });

    const savedTestCase = await newTestCase.save();

    // Send a success message along with the saved test case
    res.status(201).json({
      message: "Test case uploaded successfully!",
      testCase: savedTestCase,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating test case report" });
  }
};

// Fetch all test cases
const getTestCases = async (req, res) => {
  try {
    const testCases = await TestCase.find();
    res.status(200).json(testCases);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching test cases" });
  }
};

module.exports = {
  createTestCase,
  getTestCases,
};
