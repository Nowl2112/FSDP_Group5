let testCases = []; // Declare testCases globally

async function fetchTestCases() {
  const response = await fetch("/test-cases");
  const allTestCases = await response.json(); // Fetch all test cases
  const userEmail = localStorage.getItem("email"); // Get email from localStorage

  // Filter test cases based on user email
  testCases = allTestCases.filter(testCase => testCase.userEmail === userEmail);

  const testCaseList = document.getElementById("test-case-list");
  testCaseList.innerHTML = "";

  // Initialize a dictionary to track versions
  const fileNameVersionMap = {};

  // Process the test cases in reverse order so the latest get higher versions
  testCases.reverse().forEach((testCase) => {
    const baseFileName = testCase.fileName;

    // Check if we've seen this fileName before and increment version if needed
    if (fileNameVersionMap[baseFileName] == null) {
      fileNameVersionMap[baseFileName] = 0; // Start with version 0 if it's a new filename
    } else {
      fileNameVersionMap[baseFileName] += 1; // Increment version for duplicates
    }

    const version = fileNameVersionMap[baseFileName];
    const displayFileName = version === 0 ? baseFileName : `${baseFileName} (${version})`;

    testCase.version = version; // Assign version number to the testCase object

    // Store the modified test case back to the list
    testCase.displayFileName = displayFileName;
  });

  // Sort test cases in descending order based on the 'createdAt' field
  testCases.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Descending order

  // Display sorted test cases
  testCases.forEach((testCase) => {
    const listItem = document.createElement("li");
    listItem.textContent = testCase.displayFileName;
    listItem.onclick = () => displayTestCaseDetails(testCase);

    testCaseList.appendChild(listItem);
  });
}


// Display the selected test case details with a dropdown for general details
function displayTestCaseDetails(testCase) {
  const detailsContainer = document.getElementById("test-case-details");

  // Clear existing details
  detailsContainer.innerHTML = "";

  // Create elements for each detail you want to display
  const emailElem = document.createElement("p");
  emailElem.innerHTML = `<strong>User Email:</strong> ${testCase.userEmail}`;

  const fileNameElem = document.createElement("p");
  fileNameElem.innerHTML = `<strong>File Name:</strong> ${testCase.fileName}`;

  const createdAtElem = document.createElement("p");
  fileNameElem.innerHTML = `<strong>Created At:</strong> ${testCase.createdAt}`;

  const summaryElem = document.createElement("p");
  summaryElem.innerHTML = `<strong>Summary:</strong> ${
    testCase.testResults?.name || "No summary available"
  }`;

  // Display the number of tests, failures, errors, and skipped
  const statsElem = document.createElement("p");
  statsElem.innerHTML = `<strong>Tests:</strong> ${testCase.testResults.tests}, <strong>Failures:</strong> ${testCase.testResults.failures}, <strong>Errors:</strong> ${testCase.testResults.errors}, <strong>Skipped:</strong> ${testCase.testResults.skipped}`;

  // Create a button for toggling details visibility
  const toggleDetailsButton = document.createElement("button");
  toggleDetailsButton.textContent = "Show Details";
  toggleDetailsButton.onclick = () => {
    const detailsElem = document.getElementById(`details-${testCase._id}`);
    detailsElem.style.display =
      detailsElem.style.display === "none" ? "block" : "none";
  };

  // Create the details container (initially hidden)
  const detailsElem = document.createElement("ul");
  detailsElem.id = `details-${testCase._id}`;
  detailsElem.style.display = "none"; // Hide initially
  detailsElem.innerHTML = "<strong>Test Details:</strong>";

  // Add details from the test case
  if (
    testCase.testResults?.testcases &&
    testCase.testResults.testcases.length > 0
  ) {
    testCase.testResults.testcases.forEach((testCaseResult) => {
      const detailItem = document.createElement("li");
      detailItem.innerHTML = `<strong>${testCaseResult.name}:</strong> ${testCaseResult.status}`;

      // Display time taken for each test case
      const timeTakenElem = document.createElement("p");
      timeTakenElem.innerHTML = `<strong>Time taken:</strong> ${
        testCaseResult.time || "N/A"
      }`;
      timeTakenElem.style.marginBottom = "10px";
      detailItem.appendChild(timeTakenElem);

      const browserTypeElem = document.createElement("p");
      browserTypeElem.innerHTML = `<strong>Browser type:</strong> ${
        testCaseResult.browserType || "N/A"
      }`;
      browserTypeElem.style.marginBottom = "10px";
      detailItem.appendChild(browserTypeElem);

      // Add message dropdown if available
      if (testCaseResult.message) {
        const messageButton = document.createElement("button");
        messageButton.textContent = "Show Message";
        const messageElem = document.createElement("p");
        messageElem.textContent = testCaseResult.message;
        messageElem.style.display = "none"; // Initially hidden

        // Toggle message visibility
        messageButton.onclick = () => {
          messageElem.style.display =
            messageElem.style.display === "none" ? "block" : "none";
        };

        detailItem.appendChild(messageButton);
        detailItem.appendChild(messageElem);
      }

      detailItem.style.paddingBottom = "20px";
      detailItem.style.paddingTop = "20px";

      detailsElem.appendChild(detailItem);
    });
  } else {
    const noDetailsElem = document.createElement("p");
    noDetailsElem.textContent = "No additional details.";
    detailsElem.appendChild(noDetailsElem);
  }

  // Append all elements to the details container
  detailsContainer.appendChild(emailElem);
  detailsContainer.appendChild(fileNameElem);
  detailsContainer.appendChild(summaryElem);
  detailsContainer.appendChild(statsElem);
  detailsContainer.appendChild(toggleDetailsButton);
  detailsContainer.appendChild(detailsElem);
}

// Initialize the dashboard on page load
document.addEventListener("DOMContentLoaded", function () {
  fetchTestCases();

  const searchBar = document.getElementById("search-bar");
  const testCaseList = document.getElementById("test-case-list");

  // Function to filter and display test cases based on search input
  searchBar.addEventListener("input", function () {
    const searchText = searchBar.value.toLowerCase();
    const filteredCases = testCases.filter((testCase) =>
      testCase.fileName.toLowerCase().includes(searchText)
    );
    displayTestCases(filteredCases);
  });
});

// Function to display filtered test cases after search
function displayTestCases(filteredCases) {
  const testCaseList = document.getElementById("test-case-list");
  testCaseList.innerHTML = ""; // Clear the list first

  filteredCases.forEach((testCase) => {
    const listItem = document.createElement("li");
    listItem.textContent = testCase.displayFileName;
    listItem.onclick = () => displayTestCaseDetails(testCase);
    testCaseList.appendChild(listItem);
  });
}
