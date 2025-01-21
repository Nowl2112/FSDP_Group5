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

const deleteTestCase = async(id)=>
{
  try{
    const result = await TestCase.findByIdAndDelete(id);
    return result;

  }
  catch(err)
  {
    console.error(err);
  }
}

const renameFileName = async(id,name) =>
{
  try{

    const testCase = await TestCase.findById(id)
    if(!testCase)
    {
      return res.status(404).json({message: "Testcase not found"});
    }
    testCase.fileName = name;
    const updatedTestCase = await testCase.save();
    return updatedTestCase;
  }
  catch(err)
  {
    console.error(err);
  }
}

const addCategory = async(ID, Category) =>
{
  try
  {
    const testCase = await TestCase.findById(ID)
    if(!testCase)
    {
      return res.status(404).json({message: "Testcase not found"});
    }
    testCase.category = Category;
    const updatedTestCase = await testCase.save();
    return updatedTestCase;
  }
  catch(err)
  {
    console.error(err);
  } 
}

module.exports = {
  createTestCase,
  getTestCases,
  deleteTestCase,
  renameFileName,
  addCategory,
};
