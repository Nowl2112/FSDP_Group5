const express = require('express');
const bodyParser = require("body-parser");
const sql = require("mssql");
const mongoose = require("mongoose");
const dbConfig = require("./dbConfig");
const { exec } = require("child_process")
const fileUpload = require('express-fileupload'); 
const fs = require('fs');
const path = require('path');
const userController = require("./controllers/userController");
const utils = require("./utilities/utils")
const dbURI = "mongodb+srv://Chimken:FMGSOzqLy1SegpFI@fsdpassignment.p4h2x.mongodb.net/"



const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//User
app.get("/user", userController.getAllUser);
app.post("/user", userController.createUser);
app.post("/user/login", userController.loginUser);

app.post('/run-tests', (req, res) => {
  const name = req.body.name
  exec("mvn test", (error, stdout, stderr) => {

    // After running tests, parse the Surefire reports
    const fileName = `TEST-com.example.${name}`; // Replace with the actual file pattern as needed
    utils.parseSurefireReports(__dirname,fileName, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to parse test results', error: err.message });
        }

        res.json(result);
    });

  });
});

app.post('/upload', (req,res)=>
  {
    const fileContent = req.body.content;
    const fileName = req.body.name;
    const name = fileName.split('.')
    const pureFileName = name[0];
    // console.log(fileName)
    const targetPath = path.join(__dirname, `src\\test\\java\\com\\example\\${fileName}`);

    // console.log(targetPath)
    fs.writeFile(targetPath,fileContent, (err)=>
    {
      if(err)
      {
        { return res.status(500).json({ message: 'Error writing file.'})}
      }
    });

    exec("mvn test", (error, stdout, stderr) => {
      const xmlfileName = `TEST-com.example.${pureFileName}`; // Replace with the actual file pattern as needed
    utils.parseSurefireReports(__dirname,xmlfileName, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to parse test results', error: err.message });
        }

        res.json(result);
    });
      // const testResults = {
      //   success: false,
      //   summary: "",
      //   details: {
      //     total: 0,
      //     failures: 0,
      //     errors: 0,
      //     skipped: 0,
      //   },
      //   failureDetails: [],
      // };
  
      // if (stdout) {
      //   const resultMatch = stdout.match(
      //     /Tests run: (\d+), Failures: (\d+), Errors: (\d+), Skipped: (\d+)/
      //   );
  
      //   if (resultMatch) {
      //     testResults.details = {
      //       total: parseInt(resultMatch[1]),
      //       failures: parseInt(resultMatch[2]),
      //       errors: parseInt(resultMatch[3]),
      //       skipped: parseInt(resultMatch[4]),
      //     };
  
      //     testResults.success =
      //       testResults.details.failures === 0 &&
      //       testResults.details.errors === 0;
  
      //     testResults.summary = testResults.success
      //       ? `All ${testResults.details.total} tests passed successfully.`
      //       : `Test run completed with ${testResults.details.failures} failures, ` +
      //         `${testResults.details.errors} errors, and ${testResults.details.skipped} skipped tests.`;
      //   }
  
      //   const failureRegex =
      //     /(?:FAILURE|ERROR)!\s+([^:]+)\.([^:]+)\s*(?:.*?expected:\s*<(.+?)>\s*but was:\s*<(.+?)>|.*?Exception:\s*(.+?)(?=\[INFO\]|$))/g;
      //   let match;
  
      //   while ((match = failureRegex.exec(stdout)) !== null) {
      //     const [_, className, methodName, expected, actual, exception] = match;
      //     testResults.failureDetails.push({
      //       test: `${className}.${methodName}`,
      //       line: "73",
      //       message: exception || `expected: <${expected}> but was: <${actual}>`,
      //     });
      //   }
      // } else {
      //   testResults.summary = "No test output available";
      // }
  
      // res.json(testResults);

      fs.unlink(targetPath, (err)=>
      {
        if(err)
        {
          console.error("Error deleting file: " , err)
        }
      })
    });
  }
);


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









