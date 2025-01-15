

let testCases = []; // Declare testCases globally
let myChart;
let myChart2;
let activeTestCase = null; // Track the active test case

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
    listItem.dataset.fileName = testCase.fileName;
    listItem.dataset.version = testCase.version;

    listItem.onclick = () => {
      // Remove active class from previous selection
      const previousActive = document.querySelector('#test-case-list li.active');
      if (previousActive) {
        previousActive.classList.remove('active');
      }
      
      // Add active class to current selection
      listItem.classList.add('active');
      activeTestCase = testCase;
      
      displayTestCaseDetails(testCase);
    };

    testCaseList.appendChild(listItem);
  });
}

function displayTestCaseDetails(testCase) {
  const detailsContainer = document.getElementById("test-case-details");
  const chartContainer = document.getElementById("chart-container");
  const chartContainer2 = document.getElementById("chart-container2");

  // Clear existing details and chart
  detailsContainer.innerHTML = "";
  chartContainer.innerHTML = "";

  // Create elements for general details
  const fileNameElem = document.createElement("p");
  fileNameElem.innerHTML = `<strong>File Name:</strong> ${testCase.fileName}`;

  const createdAtElem = document.createElement("p");
  const creationDate = testCase.createdAt.split("T")[0]
  createdAtElem.innerHTML = `<strong>Created At:</strong> ${creationDate}`;

  const nameElem = document.createElement("p");
  nameElem.innerHTML = `<strong>Name:</strong> ${
    testCase.testResults?.name || "No name available"
  }`;

  const statsElem = document.createElement("p");
  statsElem.innerHTML = `<strong>Tests:</strong> ${testCase.testResults.tests}, <strong>Failures:</strong> ${testCase.testResults.failures}, <strong>Errors:</strong> ${testCase.testResults.errors}, <strong>Skipped:</strong> ${testCase.testResults.skipped}`;

  // Append general details to the container
  detailsContainer.appendChild(fileNameElem);
  detailsContainer.appendChild(createdAtElem);
  detailsContainer.appendChild(nameElem);
  detailsContainer.appendChild(statsElem);

  // Create or update the chart based on the test case results
  if (testCase.testResults && testCase.testResults.testcases) {
    const passCount = testCase.testResults.testcases.filter(tc => tc.status === "passed").length;
    const failCount = testCase.testResults.testcases.filter(tc => tc.status === "failed").length;
    const errorCount = testCase.testResults.testcases.filter(tc => tc.status === "error").length;
    const skipCount = testCase.testResults.testcases.filter(tc => tc.status !== "passed" && tc.status !== "failed" && tc.status !== "error").length;
    //Chart 1
    if (myChart) {
      myChart.data.datasets[0].data = [passCount, failCount, errorCount, skipCount];
      myChart.update();
    } else {
      myChart = new Chart(chartContainer, {
        type: 'doughnut',
        data: {
          labels: ['Pass', 'Fail', 'Error', 'Skipped'],
          datasets: [{
            label: '# of Tests',
            data: [passCount, failCount, errorCount, skipCount],
            backgroundColor: ['#9EB384', '#F26853', "#999090", '#e6b400'],
            borderWidth: 1,
            color: '#000000',
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            customCanvasBackgroundColor: {
              color: 'lightGreen',
            },
            title: {
              display: true,
              text: 'Test Case Pass/Fail Chart',
              color: '#000000',
            },
            legend: {
              labels: {
                color: '#000000',
              }
            },
          },
        }
      });
      myChart.canvas.parentNode.style.height = '500px';
      myChart.canvas.parentNode.style.width = '500px';
    }


    //Filtering by names to get unique test cases
    // const uniqueTestCase = [];
    // const uniqueNames = new Set();
    // for(let i = 0; i < Number(testCase.testResults.tests); i++)
    // {
    //   let testCaseName = testCase.testResults.testcases[i].name
    //   if(!uniqueNames.has(testCaseName))
    //   {
    //     uniqueNames.add(testCaseName);
    //     uniqueTestCase.push(testCase.testResults.testcases[i]);
    //   }
    // }

    // for(let i = 0; i < Number(testCase.testResults.tests); i++)
    //   {
    //     let testCaseName = testCase.testResults.testcases[i].name
    //     uniqueNames.forEach(element => {
    //       if(element == testCaseName)
    //       {

    //       }
    //     });
    //   }
    // Dictionary to store unique test cases and their times
    const uniqueTestCases = {};
    const avgTimeList = []

    // Populate the dictionary with test case times
    for(let i = 0; i < Number(testCase.testResults.tests); i++) {
      let testCaseName = testCase.testResults.testcases[i].name;
      let testCaseTime = Number(testCase.testResults.testcases[i].time);

      if(!uniqueTestCases[testCaseName]) {
        // If the test case name does not exist, create an array to store the times
        uniqueTestCases[testCaseName] = [];
      }

      // Add the time to the array
      uniqueTestCases[testCaseName].push(testCaseTime);
    }

    // Calculate the average time for each unique test case
    for(let testCaseName in uniqueTestCases) {
      const times = uniqueTestCases[testCaseName];
      const totalTime = times.reduce((acc, time) => acc + time, 0);
      const averageTime = totalTime / times.length;
      avgTimeList.push(averageTime);
      // console.log(`The average time for test case "${testCaseName}" is ${averageTime} seconds.`);
  }


    // let uniqueTestCaseTime = uniqueTestCase.map(test =>test.time)

    //Chart 2
    if (myChart2) {
      myChart2.data.datasets[0].data = avgTimeList;
      myChart2.update();
    } else {
      let maxLabelLength = 5; // Maximum length for the labels
      // let uniqueTestCaseName = uniqueTestCases.map(test => {
      //   if (test.name.length > maxLabelLength) {
      //     return test.name.substring(0, maxLabelLength) + '...';
      //   }
      //   return test.name;
      // });
      let unqiueTestCaseNameList = [];
      let uniqueNameList = []
      for(let testCaseName in uniqueTestCases) {
        uniqueNameList.push(testCaseName);
        if (testCaseName.length > maxLabelLength) {
          unqiueTestCaseNameList.push(testCaseName.substring(0, maxLabelLength) + '...');
        }
        else
        {
          unqiueTestCaseNameList.push(testCaseName);

        }
      }

      myChart2 = new Chart(chartContainer2, {
        type: 'line',
        data: {
          labels: unqiueTestCaseNameList,
          datasets: [{
            label: '# of Tests',
            data: avgTimeList,
            backgroundColor: ['#9EB384', '#F26853', "#999090", '#e6b400'],
            borderWidth: 1,
            color: '#000000',
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            customCanvasBackgroundColor: {
              color: 'lightGreen',
            },
            title: {
              display: true,
              text: 'Average Time taken for Test Case',
              color: '#000000',
            },
            legend: {
              labels: {
                color: '#000000',
              }
            },
            tooltip:{
              callbacks:{
                label:function(context){
                  return uniqueNameList[context.dataIndex]
                }
              }
            }
          },
        }
      });
      myChart2.canvas.parentNode.style.height = '500px';
      myChart2.canvas.parentNode.style.width = '500px';
    }

  } else {
    chartContainer.innerHTML = "No test results available.";
  }

  // Create the table for test case results
  const table = document.createElement("table");
  table.classList.add("test-case-table");
  table.innerHTML = `
    <thead>
      <tr>
        <th style="text-align: center;">Name</th> 
        <th style="text-align: center;">Success</th>
        <th style="text-align: center;">Time</th>
        <th style="text-align: center;">Summary</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  `;

  const tbody = table.querySelector("tbody");

  if (testCase.testResults?.testcases && testCase.testResults.testcases.length > 0) {
    totalTime = 0;
    testCase.testResults.testcases.forEach((testCaseResult) => {
      const lineBreak = document.createElement("br");
      const row = document.createElement("tr");

      const nameCell = document.createElement("td");
      nameCell.textContent = testCaseResult.name;

      const successCell = document.createElement("td");
      const img = document.createElement("img");
      successCell.style.display = "flex";
      successCell.style.justifyContent = "center";
      successCell.style.alignItems = "center";
      successCell.style.height = "110px";
      successCell.style.padding = "0px";
      successCell.style.margin = "0px";

      if (testCaseResult.status === "passed") {
        img.src = "https://cdn2.iconfinder.com/data/icons/greenline/512/check-512.png";
        img.alt = "Yes";
        img.classList.add("success_img");
      } else {
        img.src = "https://cdn3.iconfinder.com/data/icons/flat-actions-icons-9/792/Close_Icon_Dark-256.png";
        img.alt = "No";
        img.classList.add("failure_img");
      }
      
      successCell.appendChild(img);

      const timeCell = document.createElement("td");
      timeCell.textContent = testCaseResult.time || "N/A";
      totalTime += Number(testCaseResult.time);

      const summaryCell = document.createElement("td");
      summaryCell.textContent = testCaseResult.summary || "N/A";

      row.appendChild(nameCell);
      row.appendChild(successCell);
      row.appendChild(timeCell);
      row.appendChild(summaryCell);

      row.onclick = () => showTestCasePopup(testCaseResult);

      tbody.appendChild(row);
      tbody.appendChild(lineBreak);
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
  document.getElementById("test-case-amount-container").style.display = "flex";
  const test_case_amount_text = document.getElementById('test-case-amount-text');
  const passing_rate_text = document.getElementById("passing-rate-text");
  const avg_time_text = document.getElementById("avg-time-text");

  const passCount = testCase.testResults.testcases.filter(tc => tc.status === "passed").length;
  const total_test = Number(testCase.testResults.tests);
  test_case_amount_text.innerText = total_test;
  const passingRate = passCount/total_test;
  passing_rate_text.innerText = (passingRate*100).toFixed(1) + "%";
  avg_time_text.innerText = (totalTime/total_test).toFixed(2 )+ "s";
}

function showTestCasePopup(testCaseResult) {
  const popupContainer = document.createElement("div");
  popupContainer.classList.add("popup-container");

  const popupContent = document.createElement("div");
  popupContent.classList.add("popup-content");

  const closeButton = document.createElement("button");
  closeButton.classList.add("popup-close-btn");
  closeButton.textContent = "X";

  const nameElem = document.createElement("p");
  nameElem.innerHTML = `<strong>Name:</strong> ${testCaseResult.name}`;

  const statusElem = document.createElement("p");
  statusElem.innerHTML = `<strong>Status:</strong> ${testCaseResult.status}`;

  const browserTypeElem = document.createElement("p");
  browserTypeElem.innerHTML = `<strong>BrowserType:</strong> ${testCaseResult.browserType || "N/A"}`;

  const timeElem = document.createElement("p");
  timeElem.innerHTML = `<strong>Time:</strong> ${testCaseResult.time || "N/A"}`;

  const summaryElem = document.createElement("p");

  const boldText = document.createElement("strong");
  boldText.textContent = "Summary:";
  const normalText = document.createElement("span");
  normalText.textContent = ` ${testCaseResult.summary || "N/A"}`;
  summaryElem.appendChild(boldText);
  summaryElem.appendChild(normalText);



async function generateSummary(message) {
  const response = await fetch('/api/generate-summary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
  
  if (!response.ok) {
    console.error('Error fetching summary');
    return 'Error fetching summary';
  }
  
  const data = await response.json();
  return data.summary;
}


generateSummary(testCaseResult.message).then(aisummary => {
  normalText.textContent = aisummary || "N/A";
});



// Append both parts to the summary element
summaryElem.appendChild(boldText);
summaryElem.appendChild(normalText);




  


  const messageElem = document.createElement("p");
  messageElem.innerHTML = `<strong>Error Message:</strong> ${
    testCaseResult.message || "No message available"
  }`;

  const suggestSolutionButton = document.createElement("button");
  suggestSolutionButton.classList.add("suggest-solution-btn");
  suggestSolutionButton.textContent = "suggest solution";
  
  // Redirect to another page when clicked
  suggestSolutionButton.addEventListener("click", function () {
    window.location.href = `aipage.html`;
  });

  popupContent.appendChild(closeButton);
  popupContent.appendChild(nameElem);
  popupContent.appendChild(statusElem);
  popupContent.appendChild(timeElem);
  popupContent.appendChild(browserTypeElem);
  popupContent.appendChild(summaryElem);
  popupContent.appendChild(suggestSolutionButton);
  popupContent.appendChild(messageElem);

  popupContainer.appendChild(popupContent);
  document.body.appendChild(popupContainer);

  popupContainer.style.display = "flex";

  popupContainer.addEventListener("click", function (event) {
    if (event.target === popupContainer) {
      popupContainer.style.display = "none";
    }
  });

  closeButton.addEventListener("click", function () {
    popupContainer.style.display = "none";
  });
}

// Function to display filtered test cases after search
function displayTestCases(filteredCases) {
  const testCaseList = document.getElementById("test-case-list");
  testCaseList.innerHTML = ""; // Clear the list first

  filteredCases.forEach((testCase) => {
    const listItem = document.createElement("li");
    listItem.textContent = testCase.displayFileName;
    listItem.dataset.fileName = testCase.fileName;
    listItem.dataset.version = testCase.version;
    
    // Maintain active state if this is the active test case
    if (activeTestCase && 
        activeTestCase.fileName === testCase.fileName && 
        activeTestCase.version === testCase.version) {
      listItem.classList.add('active');
    }
    
    listItem.onclick = () => {
      const previousActive = document.querySelector('#test-case-list li.active');
      if (previousActive) {
        previousActive.classList.remove('active');
      }
      
      listItem.classList.add('active');
      activeTestCase = testCase;
      
      displayTestCaseDetails(testCase);
    };

    testCaseList.appendChild(listItem);
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