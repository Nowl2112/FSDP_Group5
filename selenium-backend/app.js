const express = require("express");
const multer = require("multer");
const { Builder } = require("selenium-webdriver");
const path = require("path");
const fs = require("fs");
const axios = require("axios");

const app = express();
const port = 3000;

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

// Endpoint to accept file uploads
app.post("/upload-tests", upload.single("testFolder"), async (req, res) => {
  const testFolder = req.file.path;

  // Check uploaded folder, and add your logic here to unzip if necessary
  // Run tests on Selenium Grid
  try {
    const results = await runTestsOnGrid(testFolder);
    res.status(200).json({ message: "Tests completed", results });
  } catch (error) {
    console.error("Error running tests:", error);
    res.status(500).json({ error: "Failed to run tests" });
  }
});

async function runTestsOnGrid(testFolder) {
  const driver = await new Builder()
    .forBrowser("chrome")
    .usingServer("http://localhost:4444")
    .build();

  // Sample test - replace with logic to dynamically run tests in uploaded folder
  await driver.get("http://example.com");
  const title = await driver.getTitle();
  console.log("Page title is:", title);

  await driver.quit();
  return { title }; // Send any test results
}

// Serve results
app.get("/results/:id", (req, res) => {
  const resultId = req.params.id;
  const resultFilePath = path.join(__dirname, "results", `${resultId}.json`);
  if (fs.existsSync(resultFilePath)) {
    res.sendFile(resultFilePath);
  } else {
    res.status(404).json({ error: "Result not found" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
