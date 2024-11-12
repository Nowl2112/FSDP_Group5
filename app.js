const express = require("express");
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

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

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


app.post("/upload", (req, res) => {
  const fileContent = req.body.content;
  const fileName = req.body.name;
  const userEmail = req.body.userEmail; // Capture the user's email
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
          testResults: result, // Save the full result object
        });

        newTestCase
          .save()
          .then((savedTestCase) => {
<<<<<<< HEAD
            res.json(result);
=======
            console.log("Test results saved:", savedTestCase);
            res.json(result); // Respond with the saved result
>>>>>>> c36aeba651e0a37d8be017f977888f19da9b10ae
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
