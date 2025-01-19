const express = require("express");
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey:'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' });
const bodyParser = require("body-parser");
const sql = require("mssql");
const mongoose = require("mongoose");
const dbConfig = require("./dbConfig");
const { exec } = require("child_process");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const path = require("path");
const userController = require("./controllers/userController");
const utils = require("./utilities/utils");
const dbURI =
  "mongodb+srv://Chimken:FMGSOzqLy1SegpFI@fsdpassignment.p4h2x.mongodb.net/";
const TestCase = require("./models/testCase");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

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
app.delete("/test-cases", async (req, res) => {
  try {
    const result = await TestCase.deleteMany({});
    res.status(200).json({ message: "All test cases deleted successfully", deletedCount: result.deletedCount });
  } catch (error) {
    console.error("Error deleting test cases:", error);
    res.status(500).json({ message: "Error deleting test cases", error });
  }
});

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

app.get("/set-cookie", (req, res) => {
  res.cookie("testCookie", "cookieValue", { httpOnly: true }); // Set a test cookie
  res.send("Cookie has been set!");
});

app.get("/get-cookie", (req, res) => {
  const testCookie = req.cookies.testCookie; // Retrieve the test cookie
  res.send(`Cookie value: ${testCookie || "No cookie found"}`);
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
