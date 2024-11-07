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
    const testResults = {
      success: false,
      summary: "",
      details: {
        total: 0,
        failures: 0,
        errors: 0,
        skipped: 0,
      },
      failureDetails: [],
    };

    if (stdout) {
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

        testResults.success =
          testResults.details.failures === 0 &&
          testResults.details.errors === 0;

        testResults.summary = testResults.success
          ? `All ${testResults.details.total} tests passed successfully.`
          : `Test run completed with ${testResults.details.failures} failures, ` +
            `${testResults.details.errors} errors, and ${testResults.details.skipped} skipped tests.`;
      }

      const failureRegex =
        /(?:FAILURE|ERROR)!\s+([^:]+)\.([^:]+)\s*(?:.*?expected:\s*<(.+?)>\s*but was:\s*<(.+?)>|.*?Exception:\s*(.+?)(?=\[INFO\]|$))/g;
      let match;

      while ((match = failureRegex.exec(stdout)) !== null) {
        const [_, className, methodName, expected, actual, exception] = match;
        testResults.failureDetails.push({
          test: `${className}.${methodName}`,
          line: "73",
          message: exception || `expected: <${expected}> but was: <${actual}>`,
        });
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
