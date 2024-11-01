// testScript.js
const { Builder, By, until } = require("selenium-webdriver");

async function runTest() {
  let driver = await new Builder().forBrowser("chrome").build();
  try {
    // Navigate to the page
    await driver.get("http://example.com");

    // Wait for the page to load and get the title
    await driver.wait(until.titleIs("Example Domain"), 10000);
    let title = await driver.getTitle();
    console.log("Page title is:", title);

    // Take a screenshot
    await driver.takeScreenshot().then((image) => {
      require("fs").writeFileSync("screenshot.png", image, "base64");
    });
  } finally {
    // Quit the driver
    await driver.quit();
  }
}

// Execute the test
runTest();
