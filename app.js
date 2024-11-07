const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql");
const mongoose = require("mongoose");
const dbConfig = require("./dbConfig");
const { exec } = require("child_process");
const userController = require("./controllers/userController");
const dbURI =
  "mongodb+srv://Chimken:FMGSOzqLy1SegpFI@fsdpassignment.p4h2x.mongodb.net/";

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
  exec("mvn test", (error, stdout, stderr) => {
    // Initialize test results object
    const testResults = {
      success: false,
      summary: "",
      details: {
        total: 0,
        failures: 0,
        errors: 0,
        skipped: 0,
      },
      testCases: [],
      failureDetails: [],
    };

    if (stdout) {
      // Parse test results
      const resultMatch = stdout.match(
        /Tests run: (\d+), Failures: (\d+), Errors: (\d+), Skipped: (\d+)/
      );
      if (resultMatch) {
        testResults.details = {
          total: parseInt(resultMatch[1]),
          failures: parseInt(resultMatch[2]),
          errors: parseInt(resultMatch[3]),
          skipped: parseInt(resultMatch[4]),
        };
      }

      // Extract all test cases being run
      const testRunRegex = /Running ([\w.]+)/g;
      let testClassMatch;
      while ((testClassMatch = testRunRegex.exec(stdout)) !== null) {
        const testClass = testClassMatch[1];

        // Find all test methods in this class
        const testMethodRegex = new RegExp(
          `${testClass}\\.([\\w]+)\\s+--\\s+Time elapsed:[\\s\\d.]+ s(?:\\s+<<<\\s+FAILURE!)?`,
          "g"
        );
        let methodMatch;

        while ((methodMatch = testMethodRegex.exec(stdout)) !== null) {
          const testName = methodMatch[0];
          const isFailure = testName.includes("FAILURE!");

          let testCase = {
            name: methodMatch[1],
            class: testClass,
            status: isFailure ? "FAILED" : "PASSED",
            error: null,
          };

          // If it's a failure, find the error message
          if (isFailure) {
            const errorMessageRegex = new RegExp(
              `${testClass}\\.${testCase.name}[\\s\\S]+?(?=\\[INFO\\]|$)`
            );
            const errorMatch = stdout.match(errorMessageRegex);
            if (errorMatch) {
              testCase.error = errorMatch[0]
                .split("\n")
                .filter((line) => line.trim() && !line.includes("Time elapsed"))
                .map((line) => line.trim())
                .join(" ")
                .replace(/\s+/g, " ")
                .trim();
            }
          }

          testResults.testCases.push(testCase);
        }
      }

      // Check if all tests passed
      testResults.success =
        !error &&
        testResults.details.failures === 0 &&
        testResults.details.errors === 0;

      // Extract failure details
      const failureRegex = /\[ERROR\]\s+([^:]+):(\d+)\s+(.*)/g;
      let match;
      while ((match = failureRegex.exec(stdout)) !== null) {
        if (!match[0].includes("Failed to execute goal")) {
          // Filter out Maven execution errors
          testResults.failureDetails.push({
            test: match[1],
            line: match[2],
            message: match[3].trim(),
          });
        }
      }

      // Create summary
      if (testResults.success) {
        testResults.summary = `All ${testResults.details.total} tests passed successfully.`;
      } else {
        testResults.summary =
          `Test run completed with ${testResults.details.failures} failures, ` +
          `${testResults.details.errors} errors, and ${testResults.details.skipped} skipped tests.`;
      }
    } else {
      testResults.summary = "No test output available";
    }

    res.json(testResults);
  });
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
