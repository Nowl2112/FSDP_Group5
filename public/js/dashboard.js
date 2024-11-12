let testCases = []; // Declare testCases globally

// Fetch test cases and populate the list
async function fetchTestCases() {
  const response = await fetch("/test-cases");
  testCases = await response.json(); // Assign fetched data to the global testCases array

  const testCaseList = document.getElementById("test-case-list");
  testCaseList.innerHTML = "";

  testCases.forEach((testCase) => {
    const listItem = document.createElement("li");
    listItem.textContent = testCase.fileName; // Use fileName for display
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
    listItem.textContent = testCase.fileName;
    listItem.onclick = () => displayTestCaseDetails(testCase);
    testCaseList.appendChild(listItem);
  });
}
