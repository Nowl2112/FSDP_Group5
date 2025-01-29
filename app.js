const express = require("express");
const OpenAI = require('openai');
require('dotenv').config();
const apiKeyStore = process.env.OPENAI_API_KEY;

const openai = new OpenAI({ apiKey:apiKeyStore });
const bodyParser = require("body-parser");
const sql = require("mssql");
const mongoose = require("mongoose");
const dbConfig = require("./dbConfig");
const { exec } = require("child_process");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");
const userController = require("./controllers/userController");
const testCaseController = require("./controllers/reportController");
const utils = require("./utilities/utils");
const dbURI =
  "mongodb+srv://Chimken:FMGSOzqLy1SegpFI@fsdpassignment.p4h2x.mongodb.net/";
const TestCase = require("./models/testCase");
const testCase = require("./models/testCase");
const axios = require("axios"); // For making HTTP requests
const cheerio = require("cheerio"); // For parsing and extracting HTML content
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

//User
app.get("/user", userController.getAllUser);
app.post("/user", userController.createUser);
app.post("/user/login", userController.loginUser);

app.post("/run-tests", (req, res) => {
  const name = req.body.name;
  exec("mvn test", (error, stdout, stderr) => {
    // After running tests, parse the Surefire reports
    const fileName = `TEST-com.example.${name}`; // Replace with the actual file pattern as needed
    utils.parseSurefireReports(__dirname, fileName, (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to parse test results",
          error: err.message,
        });
      }

      res.json(result);
    });
  });
});
// app.delete("/test-cases", async (req, res) => {
//   try {
//     const result = await TestCase.deleteMany({});
//     res.status(200).json({ message: "All test cases deleted successfully", deletedCount: result.deletedCount });
//   } catch (error) {
//     console.error("Error deleting test cases:", error);
//     res.status(500).json({ message: "Error deleting test cases", error });
//   }
// });

app.post("/upload", (req, res) => {
  const fileContent = req.body.content;
  const fileName = req.body.name;
  const userEmail = req.body.userEmail;
  const name = fileName.split(".");
  const pureFileName = name[0];

  const targetPath = path.join(
    __dirname,
    `src\\test\\java\\com\\example\\${fileName}`
  );

  // Step 1: Write the test file to disk
  fs.writeFile(targetPath, fileContent, (err) => {
    if (err) {
      return res.status(500).json({ message: "Error writing file." });
    }

    // Step 2: Run the tests using Maven
    exec("mvn test", (error, stdout, stderr) => {
      const xmlfileName = `TEST-com.example.${pureFileName}`;

      // Step 3: Parse the test results
      utils.parseSurefireReports(__dirname, xmlfileName, (err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Failed to parse test results",
            error: err.message,
          });
        }

        // Step 4: Save the test results to MongoDB
        const newTestCase = new TestCase({
          userEmail: userEmail,
          fileName: fileName,
          category: "None",
          testResults: result,
          testcases: result.testcases.map((testCase) => ({
            name: testCase.name,
            browserType:testCase.browserType,
            status: testCase.status,
            time: testCase.time,
            message: testCase.message || "",
          })),
        });

        newTestCase
          .save()
          .then((savedTestCase) => {
            console.log("Test results saved:", savedTestCase);
            res.json(result); // Respond only once here
          })
          .catch((err) => {
            console.error("Error saving test results to database:", err);
            res.status(500).json({
              message: "Error saving test results to database.",
            });
          });
      });

      // Step 5: Delete the test file after parsing and saving results
      fs.unlink(targetPath, (err) => {
        if (err) {
          console.error("Error deleting file: ", err);
        }
      });
    });
  });
});

app.get("/test-cases", async (req, res) => {
  try {
    const testCases = await TestCase.find().sort({ createdAt: -1 }); // Sorting by most recent
    res.json(testCases);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving test cases", error });
  }
});

app.delete("/test-cases/:id",async(req,res)=>
{
  try
  {
    const {id} = req.params;
    const result = await testCaseController.deleteTestCase(id);
    if(!result)
    {
      res.status(500).json({ message: "Error deleting test cases"});
    }
    else
    {
      res.status(200).json({ message: "Success deleting test cases"});

    }
  }
  catch(error)
  {
    console.error(error);
    res.status(500).json({ message: "Error deleting test cases", error });

  }
});

app.post("/file/rename",async(req,res)=>
{
  try
  {
    const {id,name} = req.body;
    const result = await testCaseController.renameFileName(id,name);
    if(!result)
      {
        res.status(500).json({ message: "Error renaming fileName"});
      }
      else
      {
        res.status(200).json({ message: "Successfully renamed"});
  
      }
  }
  catch(err)
  {
    console.error(err);
    res.status(500).json({message:"Error renaming"}, err)
  }
})

app.post("/file/category", async(req,res)=>
{
  try
  {
    const {id,category} = req.body;
    const result = await testCaseController.addCategory(id,category);
    if(!result)
      {
        res.status(500).json({ message: "Error naming category"});
      }
      else
      {
        res.status(200).json({ message: "Successful"});
  
      }
  }
  catch(err)
  {
    console.error(err);
    res.status(500).json({message:"Error naming category"}, err)
  }
})

app.post("/api/generate-summary", async (req, res) => {
  const { message } = req.body;  // Extract the message sent from frontend

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",  // Use a chat model
      messages: [
        { role: "user", content: message.concat("Only reply with a summary of the error message and nothing else, if no error just reply with no error") }  // Send the user's message
      ],
      temperature: 0.2,
      max_tokens: 1024,
      top_p: 0.7
    });

    const aiSummary = response.choices[0].message.content.trim();  // Get the AI's response
    res.json({ summary: aiSummary });  // Return the summary to frontend
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ message: "Error generating summary" });
  }
});
app.post("/api/generate-solution", async (req, res) => {
  const { url, errorMessage } = req.body; // Extract URL and error message from frontend

  try {
    // Step 1: Fetch the website content
    const response = await axios.get(url);
    const htmlContent = response.data;

    // Step 2: Extract JavaScript content (optional)
    const $ = cheerio.load(htmlContent);
    let jsContent = "";

    // Extract JavaScript from inline <script> tags
    $("script").each((_, script) => {
      const jsCode = $(script).html();
      if (jsCode) {
        jsContent += jsCode + "\n";
      }
    });

    // Step 3: Build the AI prompt
    const userPrompt = `
      I have encountered an error in my web application. Here's the information:
      - Error Message: ${errorMessage}
      - HTML Code:
      ${htmlContent}
      - JavaScript Code:
      ${jsContent}
      Please analyze the code and the error message, and provide a solution. Only reply with the suggested solution.
    `;

    // Step 4: Send the request to OpenAI API
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: userPrompt }
      ],
      temperature: 0.2,
      max_tokens: 2048, // Handle larger input
      top_p: 0.7
    });

    const aiSolution = aiResponse.choices[0].message.content.trim();

    // Step 5: Return the solution to the frontend
    res.json({ solution: aiSolution });
  } catch (error) {
    console.error("Error generating solution:", error);
    res.status(500).json({ message: "Error generating solution" });
  }
});



// Start the server and connect to the database
app.listen(port, async () => {
  try {
    // await sql.connect(dbConfig);
    mongoose.connect(dbURI);
    console.log(`Database connected and server running on port ${port}`);
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
});

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  // await sql.close();
  mongoose.connection.close();
  process.exit(0);
});
