const express = require("express");
const OpenAI = require('openai');
const nodemailer = require("nodemailer");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
require('dotenv').config();
const apiKeyStore = process.env.OPENAI_API_KEY;
const schedule = require('node-schedule');
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
const transporter = nodemailer.createTransport({
  service: "gmail", // Use your email service
  auth: {
    user: '', // Your email address
    pass: '', // Your email password or app-specific password
  },
});
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
            sendTestResultsEmail(userEmail, result);
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
    console.log(htmlContent)
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
app.post("/api/generate-solution-file", async (req, res) => {
  const { url, errorMessage } = req.body; // Extract URL and error message from frontend

  try {
    // Step 1: Fetch the website content
    const response = await axios.get(url);
    const htmlContent = response.data;
    console.log(htmlContent)
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
      Please analyze the code and the error message, and provide a solution. Only reply with fixed html and js. Nothing else.
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

const sendTestResultsEmail = (userEmail, testResults) => {
  // Create a more structured HTML template for the email
  const htmlContent = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #007BFF;
            text-align: center;
          }
          .test-case {
            margin-bottom: 20px;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            background-color: #f9f9f9;
          }
          .test-case h2 {
            margin-top: 0;
            color: #333;
          }
          .test-case p {
            margin: 5px 0;
          }
          .status-pass {
            color: #28a745;
          }
          .status-fail {
            color: #dc3545;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Test Results</h1>
          <p>Here are the results of your recent test execution:</p>
          ${testResults.testcases
            .map(
              (testCase) => `
            <div class="test-case">
              <h2>${testCase.name}</h2>
              <p><strong>Browser Type:</strong> ${testCase.browserType}</p>
              <p><strong>Status:</strong> <span class="status-${testCase.status.toLowerCase()}">${testCase.status}</span></p>
              <p><strong>Time:</strong> ${testCase.time} seconds</p>
              ${testCase.message ? `<p><strong>Message:</strong> ${testCase.message}</p>` : ''}
            </div>
          `
            )
            .join('')}
        </div>
      </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Test Results",
    text: `Your test results are ready:\n\n${JSON.stringify(testResults, null, 2)}`, // Plain text fallback
    html: htmlContent, // Enhanced HTML content
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

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

//schedule


app.post("/upload-schedule", (req, res) => {
  const { content, name, userEmail, scheduleTime } = req.body; // Retrieve payload from request body

  if (!content || !name || !userEmail || !scheduleTime) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  const fileName = name;
  const fileContent = content;

  const nameParts = fileName.split(".");
  const pureFileName = nameParts[0];

  const targetPath = path.join(
    __dirname,
    `src\\test\\java\\com\\example\\${fileName}`
  );

  // Step 1: Write the test file to disk
  fs.writeFile(targetPath, fileContent, (err) => {
    if (err) {
      return res.status(500).json({ message: "Error writing file." });
    }

    // Step 2: Schedule the test execution
    const job = schedule.scheduleJob(new Date(scheduleTime), () => {
      console.log(`Running scheduled test for file: ${fileName} at ${scheduleTime}`);

      // Step 3: Run the tests using Maven
      exec("mvn test", (error, stdout, stderr) => {
        const xmlfileName = `TEST-com.example.${pureFileName}`;

        // Step 4: Parse the test results
        utils.parseSurefireReports(__dirname, xmlfileName, (err, result) => {
          if (err) {
            console.error("Failed to parse test results:", err.message);
            return;
          }

          // Step 5: Save the test results to MongoDB
          const newTestCase = new TestCase({
            userEmail: userEmail,
            fileName: fileName,
            category: "None",
            testResults: result,
            testcases: result.testcases.map((testCase) => ({
              name: testCase.name,
              browserType: testCase.browserType,
              status: testCase.status,
              time: testCase.time,
              message: testCase.message || "",
            })),
          });

          newTestCase
            .save()
            .then((savedTestCase) => {
              console.log("Test results saved:", savedTestCase);
              sendTestResultsEmail(userEmail, result);
            })
            .catch((err) => {
              console.error("Error saving test results to database:", err);
            });

          // Step 6: Delete the test file after parsing and saving results
          fs.unlink(targetPath, (err) => {
            if (err) {
              console.error("Error deleting file: ", err);
            }
          });
        });
      });
    });

    res.json({ message: `Test scheduled to run at ${scheduleTime}` });
  });
});