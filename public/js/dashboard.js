// Fetch test cases and populate the list
async function fetchTestCases() {
  const response = await fetch("/test-cases");
  const testCases = await response.json();

  const testCaseList = document.getElementById("test-case-list");
  testCaseList.innerHTML = "";

  testCases.forEach((testCase) => {
    const listItem = document.createElement("li");
    listItem.textContent = testCase.fileName; // Use fileName for display
    listItem.onclick = () => displayTestCaseDetails(testCase);
    testCaseList.appendChild(listItem);
  });
}

// Display the selected test case details
function displayTestCaseDetails(testCase) {
  const detailsContainer = document.getElementById("test-case-details");

  // Clear existing details
  detailsContainer.innerHTML = "";

  // Create elements for each detail you want to display
  const emailElem = document.createElement("p");
  emailElem.textContent = `User Email: ${testCase.userEmail}`;

  const fileNameElem = document.createElement("p");
  fileNameElem.textContent = `File Name: ${testCase.fileName}`;

  const summaryElem = document.createElement("p");
  summaryElem.textContent = `Summary: ${
    testCase.testResults?.name || "No summary available"
  }`;

  // Display the number of tests, failures, errors, and skipped
  const statsElem = document.createElement("p");
  statsElem.textContent = `Tests: ${testCase.testResults.tests}, Failures: ${testCase.testResults.failures}, Errors: ${testCase.testResults.errors}, Skipped: ${testCase.testResults.skipped}`;

  // Display failure details if present
  const failureDetailsElem = document.createElement("ul");
  failureDetailsElem.textContent = "Failure Details:";

  if (
    testCase.testResults?.testcases &&
    testCase.testResults.testcases.length > 0
  ) {
    testCase.testResults.testcases.forEach((testCaseResult) => {
      const detailItem = document.createElement("li");
      detailItem.textContent = `${testCaseResult.name}: ${testCaseResult.status}`;
      if (testCaseResult.message) {
        const messageItem = document.createElement("p");
        messageItem.textContent = `Message: ${testCaseResult.message}`;
        detailItem.appendChild(messageItem);
      }
      failureDetailsElem.appendChild(detailItem);
    });
  } else {
    const noFailuresElem = document.createElement("p");
    noFailuresElem.textContent = "No failures.";
    failureDetailsElem.appendChild(noFailuresElem);
  }

  // Append all elements to the details container
  detailsContainer.appendChild(emailElem);
  detailsContainer.appendChild(fileNameElem);
  detailsContainer.appendChild(summaryElem);
  detailsContainer.appendChild(statsElem);
  detailsContainer.appendChild(failureDetailsElem);
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
    listItem.textContent = testCase.fileName;
    listItem.onclick = () => displayTestCaseDetails(testCase);
    testCaseList.appendChild(listItem);
  });
}
