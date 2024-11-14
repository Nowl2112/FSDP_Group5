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

  // Create elements for general details
  const emailElem = document.createElement("p");
  emailElem.innerHTML = `<strong>User Email:</strong> ${testCase.userEmail}`;

  const fileNameElem = document.createElement("p");
  fileNameElem.innerHTML = `<strong>File Name:</strong> ${testCase.fileName}`;

  const createdAtElem = document.createElement("p");
  createdAtElem.innerHTML = `<strong>Created At:</strong> ${testCase.createdAt}`;

  const nameElem = document.createElement("p");
  nameElem.innerHTML = `<strong>Name:</strong> ${
    testCase.testResults?.name || "No name available"
  }`;

  const statsElem = document.createElement("p");
  statsElem.innerHTML = `<strong>Tests:</strong> ${testCase.testResults.tests}, <strong>Failures:</strong> ${testCase.testResults.failures}, <strong>Errors:</strong> ${testCase.testResults.errors}, <strong>Skipped:</strong> ${testCase.testResults.skipped}`;

  // Append general details to the container
  detailsContainer.appendChild(emailElem);
  detailsContainer.appendChild(fileNameElem);
  detailsContainer.appendChild(createdAtElem);
  detailsContainer.appendChild(nameElem);
  detailsContainer.appendChild(statsElem);

  // Create the table for test case results
  const table = document.createElement("table");
  table.classList.add("test-case-table");
  table.innerHTML = `
    <thead>
      <tr>
        <th>Name</th>
        <th>Success</th>
        <th>Time</th>
        <th>Summary</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  `;

  const tbody = table.querySelector("tbody");

  // Populate table rows
  if (testCase.testResults?.testcases && testCase.testResults.testcases.length > 0) {
    testCase.testResults.testcases.forEach((testCaseResult) => {
      const row = document.createElement("tr");

      // Row data
      const nameCell = document.createElement("td");
      nameCell.textContent = testCaseResult.name;

      const successCell = document.createElement("td");
      successCell.textContent = testCaseResult.status === "passed" ? "Yes" : "No";

      const timeCell = document.createElement("td");
      timeCell.textContent = testCaseResult.time || "N/A";

      const summaryCell = document.createElement("td");
      summaryCell.textContent = testCaseResult.summary || "N/A";

      // Append cells to the row
      row.appendChild(nameCell);
      row.appendChild(successCell);
      row.appendChild(timeCell);
      row.appendChild(summaryCell);

      // Add click event to show popup on row click
      row.onclick = () => showTestCasePopup(testCaseResult);

      tbody.appendChild(row);
    });
  } else {
    const noResultsRow = document.createElement("tr");
    const noResultsCell = document.createElement("td");
    noResultsCell.colSpan = 4;
    noResultsCell.textContent = "No test results available";
    noResultsRow.appendChild(noResultsCell);
    tbody.appendChild(noResultsRow);
  }

  detailsContainer.appendChild(table);
}

// Function to show the popup with detailed information
function showTestCasePopup(testCaseResult) {
  // Create a popup container
  const popupContainer = document.createElement("div");
  popupContainer.classList.add("popup-container");

  // Create a popup content area
  const popupContent = document.createElement("div");
  popupContent.classList.add("popup-content");

  // Close button for the popup
  const closeButton = document.createElement("button");
  closeButton.classList.add("popup-close-btn");
  closeButton.textContent = "X";

  // Create the details for the popup
  const nameElem = document.createElement("p");
  nameElem.innerHTML = `<strong>Name:</strong> ${testCaseResult.name}`;

  const statusElem = document.createElement("p");
  statusElem.innerHTML = `<strong>Status:</strong> ${testCaseResult.status}`;

  const timeElem = document.createElement("p");
  timeElem.innerHTML = `<strong>Time:</strong> ${testCaseResult.time || "N/A"}`;

  const summaryElem = document.createElement("p");

const boldText = document.createElement("strong");
boldText.textContent = "Summary:";

const normalText = document.createElement("span");
normalText.textContent = ` ${testCaseResult.summary || "N/A"}`;

// Append both parts to the summary element
summaryElem.appendChild(boldText);
summaryElem.appendChild(normalText);


  

  const messageElem = document.createElement("p");
  messageElem.innerHTML = `<strong>Error Message:</strong> ${
    testCaseResult.message || "No message available"
  }`;

  // Append everything to the popup content
  popupContent.appendChild(closeButton);
  popupContent.appendChild(nameElem);
  popupContent.appendChild(statusElem);
  popupContent.appendChild(timeElem);
  popupContent.appendChild(summaryElem);
  popupContent.appendChild(messageElem);

  // Append the popup content to the popup container
  popupContainer.appendChild(popupContent);

  // Append the popup container to the body
  document.body.appendChild(popupContainer);

  // Display the popup
  popupContainer.style.display = "flex";

  // Close the popup when clicking outside the popup content
  popupContainer.addEventListener("click", function (event) {
    if (event.target === popupContainer) {
      popupContainer.style.display = "none"; // Close the popup
    }
  });

  // Close the popup when the close button is clicked
  closeButton.addEventListener("click", function () {
    popupContainer.style.display = "none"; // Close the popup
  });
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
