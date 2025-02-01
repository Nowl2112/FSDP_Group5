let testCases = []; // Declare testCases globally
let myChart;
let myChart2;
let myChart3;

let activeTestCase = null; // Track the active test case
let currentFilter = 'all'; // Track current status filter
let currentCategory = 'all'
let selectedTestCasesForComparison = [];
let isComparisonMode = false;


async function fetchTestCases() {
  const response = await fetch("/test-cases");
  const allTestCases = await response.json();
  const userEmail = localStorage.getItem("email");

  testCases = allTestCases.filter(testCase => testCase.userEmail === userEmail);
  const testCaseList = document.getElementById("test-case-list");
  testCaseList.innerHTML = "";

  const fileNameVersionMap = {};

  testCases.reverse().forEach((testCase) => {
    const baseFileName = testCase.fileName;

    if (fileNameVersionMap[baseFileName] == null) {
      fileNameVersionMap[baseFileName] = 0;
    } else {
      fileNameVersionMap[baseFileName] += 1;
    }

    const version = fileNameVersionMap[baseFileName];
    const displayFileName = version === 0 ? baseFileName : `${baseFileName} (${version})`;

    testCase.version = version;
    testCase.displayFileName = displayFileName;
  });

  testCases.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  updateCategoryFilterOptions();
  displayFilteredTestCases(testCases);
}

function filterTestCasesByStatus(testCase) {
  
  if (currentCategory !== 'all' && testCase.category !== currentCategory) {
    return false;
  }

  if (currentFilter === 'all') return true;
  
  const passCount = testCase.testResults.testcases.filter(tc => tc.status === "passed").length;
  const totalTests = testCase.testResults.testcases.length;
  
  switch(currentFilter) {
    case 'passed':
      return passCount === totalTests;
    case 'failed':
      return passCount < totalTests;
    default:
      return true;
  }
}


function createTestCaseListItem(testCase) {
  const listItem = document.createElement("li");
  
  // Create span for test case name
  const nameSpan = document.createElement("span");
  nameSpan.textContent = testCase.displayFileName;
  nameSpan.className = "test-case-name";
  
  const comparisonCheckbox = document.createElement("input");
  comparisonCheckbox.type = "checkbox";
  comparisonCheckbox.className = "comparison-checkbox";
  comparisonCheckbox.style.display = "none";
  comparisonCheckbox.addEventListener("change", (e) => {
    e.stopPropagation();
    handleTestCaseComparisonSelection(testCase, comparisonCheckbox.checked);
  });

  // Create setting button
  const settingButton = document.createElement("button");
  // settingButton.textContent = "Delete";
  settingButton.className = "test-case-delete-btn";
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="setting">
    <g fill="none" fill-rule="evenodd" stroke="#200E32" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" transform="translate(2.5 1.5)">
      <path d="M18.3066362,6.12356982 L17.6842106,5.04347829 C17.1576365,4.12955711 15.9906873,3.8142761 15.0755149,4.33867279 L15.0755149,4.33867279 C14.6398815,4.59529992 14.1200613,4.66810845 13.6306859,4.54104256 C13.1413105,4.41397667 12.7225749,4.09747295 12.4668193,3.66132725 C12.3022855,3.38410472 12.2138742,3.06835005 12.2105264,2.74599544 L12.2105264,2.74599544 C12.2253694,2.22917739 12.030389,1.72835784 11.6700024,1.3576252 C11.3096158,0.986892553 10.814514,0.777818938 10.2974829,0.778031878 L9.04347831,0.778031878 C8.53694532,0.778031878 8.05129106,0.97987004 7.69397811,1.33890085 C7.33666515,1.69793166 7.13715288,2.18454839 7.13958814,2.69107553 L7.13958814,2.69107553 C7.12457503,3.73688099 6.27245786,4.57676682 5.22654465,4.57665906 C4.90419003,4.57331126 4.58843537,4.48489995 4.31121284,4.32036615 L4.31121284,4.32036615 C3.39604054,3.79596946 2.22909131,4.11125048 1.70251717,5.02517165 L1.03432495,6.12356982 C0.508388616,7.03634945 0.819378585,8.20256183 1.72997713,8.73226549 L1.72997713,8.73226549 C2.32188101,9.07399614 2.68650982,9.70554694 2.68650982,10.3890161 C2.68650982,11.0724852 2.32188101,11.704036 1.72997713,12.0457667 L1.72997713,12.0457667 C0.820534984,12.5718952 0.509205679,13.7352837 1.03432495,14.645309 L1.03432495,14.645309 L1.6659039,15.7345539 C1.9126252,16.1797378 2.3265816,16.5082503 2.81617164,16.6473969 C3.30576167,16.7865435 3.83061824,16.7248517 4.27459956,16.4759726 L4.27459956,16.4759726 C4.71105863,16.2212969 5.23116727,16.1515203 5.71931837,16.2821523 C6.20746948,16.4127843 6.62321383,16.7330005 6.87414191,17.1716248 C7.03867571,17.4488473 7.12708702,17.764602 7.13043482,18.0869566 L7.13043482,18.0869566 C7.13043482,19.1435014 7.98693356,20.0000001 9.04347831,20.0000001 L10.2974829,20.0000001 C11.3504633,20.0000001 12.2054882,19.1490783 12.2105264,18.0961099 L12.2105264,18.0961099 C12.2080776,17.5879925 12.4088433,17.0999783 12.7681408,16.7406809 C13.1274382,16.3813834 13.6154524,16.1806176 14.1235699,16.1830664 C14.4451523,16.1916732 14.7596081,16.2797208 15.0389017,16.4393593 L15.0389017,16.4393593 C15.9516813,16.9652957 17.1178937,16.6543057 17.6475973,15.7437072 L17.6475973,15.7437072 L18.3066362,14.645309 C18.5617324,14.2074528 18.6317479,13.6859659 18.5011783,13.1963297 C18.3706086,12.7066935 18.0502282,12.2893121 17.6109841,12.0366133 L17.6109841,12.0366133 C17.17174,11.7839145 16.8513595,11.3665332 16.7207899,10.876897 C16.5902202,10.3872608 16.6602358,9.86577384 16.9153319,9.42791767 C17.0812195,9.13829096 17.3213574,8.89815312 17.6109841,8.73226549 L17.6109841,8.73226549 C18.5161253,8.20284891 18.8263873,7.04344892 18.3066362,6.13272314 L18.3066362,6.13272314 L18.3066362,6.12356982 Z"></path>
      <circle cx="9.675" cy="10.389" r="2.636"></circle>
    </g>
  </svg>`;
  
  // Set the SVG as the button's content
  settingButton.innerHTML = svg;
  // Add click handler for setting button
  settingButton.onclick = (e) => {
    e.stopPropagation(); // Prevent triggering the li click event
    openSettingsModal(testCase);
  
  };



  listItem.dataset.fileName = testCase.fileName;
  listItem.dataset.version = testCase.version;
  
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

  // Append elements to list item
  listItem.appendChild(nameSpan);
  listItem.appendChild(comparisonCheckbox);

  listItem.appendChild(settingButton);

  return listItem;
}

// Open the settings modal
function openSettingsModal(testCase) {
  const modal = document.getElementById("settings-modal");
  const modalName = document.getElementById("modal-test-case-name");
  const renameInput = document.getElementById("rename-input");
  const categoryInput = document.getElementById("category-input");
  
  modal.style.display = "block";
  modalName.textContent = testCase.displayFileName; // Show test case name in the modal
  
  modal.addEventListener("click",function(event)
  {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Handle the Save Changes button
  document.getElementById("save-settings-btn").onclick = () => {
      // Get the values from input fields
      const newName = renameInput.value;
      const newCategory = categoryInput.value;
      console.log(newCategory)
      if (newName != "") {
        console.log(`Renaming test case to: ${newName}`);
        // Handle renaming functionality here
        async function renameFileName(ID) {
          const response = await fetch(`/file/rename`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              id:  ID,
              name : newName
            })
          });
          if(!response)
          {
            console.error("Error renaming testcase");
          }
        }
        renameFileName(testCase._id);

      }

      if (newCategory != "") {
        console.log(`Setting category to: ${newCategory}`);
        // Handle category functionality here
        async function addCategory(ID) {
          const response = await fetch(`/file/category`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: ID,
              category: newCategory,

            })
          });
          if(!response)
          {
            console.error("Error adding category");
          }
          
          
        
        }
        // console.log(newCategory)
        addCategory(testCase._id);

      }

      // Close modal
      modal.style.display = "none";
      window.location.reload();
    
  
  }
  // Handle the Delete button
  document.getElementById("delete-btn").onclick = () => {
    console.log(`Deleting test case: ${testCase.displayFileName}`);
    // Add delete functionality here
    // const id = testCase.
    async function deleteTestCase(id) {
      const response = await fetch(`/test-cases/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        // body: JSON.stringify({ message })
      });
      if(!response)
      {
        console.error("Error deleting testcase");
      }
      else
      {
        window.location.reload();
      }
      
    
    }
    deleteTestCase(testCase._id);
    modal.style.display = "none";
  };

  // Handle the Cancel button
  document.getElementById("cancel-settings-btn").onclick = () => {
    modal.style.display = "none";
  };
}

function displayFilteredTestCases(cases) {
  const filteredCases = cases.filter(filterTestCasesByStatus);
  const testCaseList = document.getElementById("test-case-list");
  testCaseList.innerHTML = "";

  const overallStats = createOverallStatsTestCase(cases);

  const overallStatsItem = createOverallStatsListItem(overallStats);
  testCaseList.appendChild(overallStatsItem);

  filteredCases.forEach((testCase) => {
    const listItem = createTestCaseListItem(testCase);
    testCaseList.appendChild(listItem);
  });
}

function createOverallStatsTestCase(allTestCases) {
  // Sort test cases by date
  const sortedTestCases = allTestCases.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  // Create cumulative test results
  let cumulativeTestCase = {
    fileName: "Overall Statistics",
    displayFileName: "Overall Statistics",
    createdAt: new Date().toISOString(), // Current date
    category: "Statistics",
    testResults: {
      name: "Cumulative Test Results",
      tests: 0,
      failures: 0,
      errors: 0,
      skipped: 0,
      testcases: []
    }
  };

  // Aggregate all test cases
  sortedTestCases.forEach(tc => {
    cumulativeTestCase.testResults.tests += Number(tc.testResults.tests);
    cumulativeTestCase.testResults.failures += Number(tc.testResults.failures);
    cumulativeTestCase.testResults.errors += Number(tc.testResults.errors);
    cumulativeTestCase.testResults.skipped += Number(tc.testResults.skipped);

    // Merge test cases while keeping track of cumulative results
    tc.testResults.testcases.forEach(testCase => {
      const existingTest = cumulativeTestCase.testResults.testcases.find(t => t.name === testCase.name);
      
      if (existingTest) {
        // Update existing test case with cumulative status
        existingTest.status = testCase.status; // Keep most recent status
        existingTest.time = (Number(existingTest.time) + Number(testCase.time)).toString();
        existingTest.summary = `${existingTest.summary}\n${testCase.summary || ''}`;
      } else {
        // Add new test case
        cumulativeTestCase.testResults.testcases.push({
          ...testCase,
          time: testCase.time || '0',
          summary: testCase.summary || ''
        });
      }
    });
  });
  console.log(cumulativeTestCase)
  return cumulativeTestCase;
}

function createOverallStatsListItem(overallStats) {
  const listItem = document.createElement("li");
  listItem.classList.add('overall-stats-item');
  
  // Create span for name
  const nameSpan = document.createElement("span");
  nameSpan.textContent = "Overall Statistics";
  nameSpan.className = "test-case-name";
  
  listItem.onclick = () => {
    const previousActive = document.querySelector('#test-case-list li.active');
    if (previousActive) {
      previousActive.classList.remove('active');
    }
    
    listItem.classList.add('active');
    displayOverallStatsDetails(overallStats);
  };

  listItem.appendChild(nameSpan);
  return listItem;
}
function displayOverallStatsDetails(overallStats) {
  const detailsContainer = document.getElementById("test-case-details");
  const test_case_amount_text = document.getElementById('test-case-amount-text');
  const passing_rate_text = document.getElementById("passing-rate-text");
  const avg_time_text = document.getElementById("avg-time-text");
  const chartContainer = document.getElementById("chart-container");
  const chartContainer2 = document.getElementById("chart-container2");

  detailsContainer.innerHTML = "";
  chartContainer.innerHTML = "";
  chartContainer2.innerHTML = "";

  // Calculate overall statistics
  const totalTests = overallStats.testResults.tests;
  const passingRate = totalTests - overallStats.testResults.failures;
  const failCount = overallStats.testResults.failures;
  const errorCount = overallStats.testResults.skipped;
  const skipCount = overallStats.testResults.testcases.filter(tc => 
    tc.status !== "passed" && tc.status !== "failed" && tc.status !== "error"
  ).length;
  const totalTime = overallStats.testResults.testcases.reduce((sum, tc) => sum + Number(tc.time), 0);

  test_case_amount_text.textContent = totalTests;
  passing_rate_text.textContent = passingRate.toFixed(1)+"%";
  avg_time_text.textContent = (totalTime / totalTests).toFixed(2)+"s";

  // Update or create the status distribution chart
  if (myChart) {
    myChart.destroy();
  }
  
  myChart = new Chart(chartContainer, {
    type: 'doughnut',
    data: {
      labels: ['Pass', 'Fail', 'Error', 'Skipped'],
      datasets: [{
        label: 'Test Results Distribution',
        data: [passingRate, failCount, errorCount, skipCount],
        backgroundColor: ['#9EB384', '#F26853', "#999090", '#e6b400'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        title: {
          display: true,
          text: 'Overall Test Results Distribution',
          color: '#000000',
          font: {
            size: 16,
            weight: 'bold'
          }
        },
        legend: {
          position: 'bottom'
        }
      }
    }
  });
  myChart.canvas.parentNode.style.height = '500px';
  myChart.canvas.parentNode.style.width = '500px';

  // Calculate pass rate for each test case file
  const filePassRates = testCases.map(testCase => {
    const totalTestsInFile = testCase.testResults.testcases.length;
    const passedTests = testCase.testResults.testcases.filter(tc => tc.status === "passed").length;
    const passRate = (passedTests / totalTestsInFile) * 100;
    
    return {
      name: testCase.displayFileName,
      passRate: passRate
    };
  });

  // Sort by date (assuming testCases is already sorted by date)
  const trendData = filePassRates;
  console.log(trendData);
  // Create trend chart
  if (myChart3) {
    myChart3.destroy();
    myChart3 = null;
  }
  
  
  if (myChart2) {
    myChart2.destroy();
    myChart2 = null;
  }

  myChart3 = new Chart(chartContainer2, {
    type: 'line',
    data: {
      labels: trendData.map(d => d.name.substring(0,3)+"..."),
      datasets: [{
        label: 'Pass Rate by Test Case File',
        data: trendData.map(d => d.passRate),
        borderColor: 'rgba(57, 43, 92, 0.2)',
        backgroundColor: 'rgba(127, 94, 202, 0.2)',
        tension: 0.1,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        title: {
          display: true,
          text: 'Pass Rate Trend Across Test Files',
          color: '#000000',
          font: {
            size: 16,
            weight: 'bold'
          }
        },
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return trendData[context.dataIndex].name + ` Pass Rate: ${context.raw.toFixed(1)}%`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: 'Pass Rate (%)'
          }
        },
        x: {
          ticks: {
            maxRotation: 45,
            minRotation: 45
          }
        }
      }
    }
  });
  myChart3.canvas.parentNode.style.height = '500px';
  myChart3.canvas.parentNode.style.width = '500px';
}


// function displayTestCases(filteredCases) {
//   const testCaseList = document.getElementById("test-case-list");
//   testCaseList.innerHTML = "";

//   console.log(cases);
//   const overallStats = createOverallStatsTestCase(cases);

//   const overallStatsItem = createOverallStatsListItem(overallStats);
//   testCaseList.appendChild(overallStatsItem);
//   // Apply both search filter and status/category filter
//   const filteredByStatusAndCategory = filteredCases.filter(filterTestCasesByStatus);
//   filteredByStatusAndCategory.forEach((testCase) => {
//     const listItem = createTestCaseListItem(testCase);
//     testCaseList.appendChild(listItem);
//   });
// }

function displayTestCaseDetails(testCase) {
  const detailsContainer = document.getElementById("test-case-details");
  const chartContainer = document.getElementById("chart-container");
  const chartContainer2 = document.getElementById("chart-container2");

  detailsContainer.innerHTML = "";
  chartContainer.innerHTML = "";

// Create a header div to hold the button
const headerDiv = document.createElement("div");
headerDiv.style.display = "flex";
headerDiv.style.justifyContent = "space-between";
headerDiv.style.alignItems = "center";
headerDiv.style.marginBottom = "10px";

// Create the comparison button
const comparisonButton = document.createElement("button");
if(isComparisonMode)
{
  comparisonButton.textContent = "Exit Comparison Mode" ;
}
else
{
  comparisonButton.textContent = "Enter Comparison Mode";

}
comparisonButton.classList.add("test-case-comparison-btn");
comparisonButton.style.padding = "5px 10px";
comparisonButton.style.backgroundColor = "#4CAF50";
comparisonButton.style.color = "white";
comparisonButton.style.border = "none";
comparisonButton.style.borderRadius = "4px";
comparisonButton.style.cursor = "pointer";


// // Add click event listener for the button
// const listItems = document.querySelectorAll('#test-case-list li');
// listItems.forEach(item => {
//   const checkbox = item.querySelector('.comparison-checkbox');
//   if (checkbox) {
//     checkbox.style.display = 'none';
//   }
// });

// Add click event listener for the button
// console.log(isComparisonMode);
comparisonButton.addEventListener('click', () => {
  isComparisonMode = !isComparisonMode;

  const listItems = document.querySelectorAll('#test-case-list li');
  
  listItems.forEach(item => {
    // Toggle checkboxes
    const checkbox = item.querySelector('.comparison-checkbox');
    const settingButton = item.querySelector('.test-case-delete-btn');
    
    if (checkbox) {
      checkbox.style.display = isComparisonMode ? 'block' : 'none';
      checkbox.checked = false;
    }
    
    // Hide/show setting buttons
    if (settingButton) {
      settingButton.style.display = isComparisonMode ? 'none' : 'block';
    }
  });

  // Update button text
  comparisonButton.textContent = isComparisonMode 
    ? "Exit Comparison Mode" 
    : "Enter Comparison Mode";

  // Reset selected test cases if exiting mode
  if (!isComparisonMode) {
    selectedTestCasesForComparison = [];
  }
});
// Add the button to the header div
headerDiv.appendChild(comparisonButton);

// Add the header div to the details container
detailsContainer.appendChild(headerDiv);

  const fileNameElem = document.createElement("p");
  fileNameElem.innerHTML = `<strong>File Name:</strong> ${testCase.fileName}`;

  const createdAtElem = document.createElement("p");
  const creationDate = testCase.createdAt.split("T")[0]
  createdAtElem.innerHTML = `<strong>Created At:</strong> ${creationDate}`;

  const nameElem = document.createElement("p");
  nameElem.innerHTML = `<strong>Name:</strong> ${
    testCase.testResults?.name || "No name available"
  }`;

  const categoryElem = document.createElement("p");
  categoryElem.innerHTML = `<strong>Category:</strong> ${testCase.category || 'No category'} ` 

  const statsElem = document.createElement("p");
  statsElem.innerHTML = `<strong>Tests:</strong> ${testCase.testResults.tests}, <strong>Failures:</strong> ${testCase.testResults.failures}, <strong>Errors:</strong> ${testCase.testResults.errors}, <strong>Skipped:</strong> ${testCase.testResults.skipped}`;

  detailsContainer.appendChild(fileNameElem);
  detailsContainer.appendChild(createdAtElem);
  detailsContainer.appendChild(nameElem);
  detailsContainer.appendChild(categoryElem)
  detailsContainer.appendChild(statsElem);
  if (myChart3) {
    myChart3.destroy();
    myChart3 = null;
  }
  
  if (myChart) {
    myChart.destroy();
    myChart = null;
  }
  
  if (myChart2) {
    myChart2.destroy();
    myChart2 = null;
  }
  if (testCase.testResults && testCase.testResults.testcases) {
    const passCount = testCase.testResults.testcases.filter(tc => tc.status === "passed").length;
    const failCount = testCase.testResults.testcases.filter(tc => tc.status === "failed").length;
    const errorCount = testCase.testResults.testcases.filter(tc => tc.status === "error").length;
    const skipCount = testCase.testResults.testcases.filter(tc => tc.status !== "passed" && tc.status !== "failed" && tc.status !== "error").length;

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

    const uniqueTestCases = {};
    const avgTimeList = []

    for(let i = 0; i < Number(testCase.testResults.tests); i++) {
      let testCaseName = testCase.testResults.testcases[i].name;
      let testCaseTime = Number(testCase.testResults.testcases[i].time);

      if(!uniqueTestCases[testCaseName]) {
        uniqueTestCases[testCaseName] = [];
      }

      uniqueTestCases[testCaseName].push(testCaseTime);
    }

    for(let testCaseName in uniqueTestCases) {
      const times = uniqueTestCases[testCaseName];
      const totalTime = times.reduce((acc, time) => acc + time, 0);
      const averageTime = totalTime / times.length;
      avgTimeList.push(averageTime);
    }

    if (myChart2) {
      myChart2.data.datasets[0].data = avgTimeList;
      myChart2.update();
      myChart2.destroy();
    } else {
      let maxLabelLength = 5;
      let unqiueTestCaseNameList = [];
      let uniqueNameList = []
      for(let testCaseName in uniqueTestCases) {
        uniqueNameList.push(testCaseName);
        if (testCaseName.length > maxLabelLength) {
          unqiueTestCaseNameList.push(testCaseName.substring(0, maxLabelLength) + '...');
        }
        else {
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
  avg_time_text.innerText = (totalTime/total_test).toFixed(2) + "s";
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

  const messageElem = document.createElement("p");
  messageElem.innerHTML = `<strong>Error Message:</strong> ${
    testCaseResult.message || "No message available"
  }`;

  popupContent.appendChild(closeButton);
  popupContent.appendChild(nameElem);
  popupContent.appendChild(statusElem);
  popupContent.appendChild(timeElem);
  popupContent.appendChild(browserTypeElem);
  popupContent.appendChild(summaryElem);
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
  testCaseList.innerHTML = "";

  const searchBar = document.getElementById("search-bar");
  // console.log(searchBar.value);
  if(currentCategory == "all" && currentFilter == "all" && searchBar.value == "")
  {
    const overallStats = createOverallStatsTestCase(filteredCases);

    const overallStatsItem = createOverallStatsListItem(overallStats);
    testCaseList.appendChild(overallStatsItem);
  }


  // Apply both search filter and status filter
  const statusFilteredCases = filteredCases.filter(filterTestCasesByStatus);

  statusFilteredCases.forEach((testCase) => {
    const listItem = document.createElement("li");
    
    // Create span for test case name
    const nameSpan = document.createElement("span");
    nameSpan.textContent = testCase.displayFileName;
    nameSpan.className = "test-case-name";
    
    const settingButton = document.createElement("button");
    // settingButton.textContent = "Delete";
    settingButton.className = "test-case-delete-btn";
    
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="setting">
      <g fill="none" fill-rule="evenodd" stroke="#200E32" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" transform="translate(2.5 1.5)">
        <path d="M18.3066362,6.12356982 L17.6842106,5.04347829 C17.1576365,4.12955711 15.9906873,3.8142761 15.0755149,4.33867279 L15.0755149,4.33867279 C14.6398815,4.59529992 14.1200613,4.66810845 13.6306859,4.54104256 C13.1413105,4.41397667 12.7225749,4.09747295 12.4668193,3.66132725 C12.3022855,3.38410472 12.2138742,3.06835005 12.2105264,2.74599544 L12.2105264,2.74599544 C12.2253694,2.22917739 12.030389,1.72835784 11.6700024,1.3576252 C11.3096158,0.986892553 10.814514,0.777818938 10.2974829,0.778031878 L9.04347831,0.778031878 C8.53694532,0.778031878 8.05129106,0.97987004 7.69397811,1.33890085 C7.33666515,1.69793166 7.13715288,2.18454839 7.13958814,2.69107553 L7.13958814,2.69107553 C7.12457503,3.73688099 6.27245786,4.57676682 5.22654465,4.57665906 C4.90419003,4.57331126 4.58843537,4.48489995 4.31121284,4.32036615 L4.31121284,4.32036615 C3.39604054,3.79596946 2.22909131,4.11125048 1.70251717,5.02517165 L1.03432495,6.12356982 C0.508388616,7.03634945 0.819378585,8.20256183 1.72997713,8.73226549 L1.72997713,8.73226549 C2.32188101,9.07399614 2.68650982,9.70554694 2.68650982,10.3890161 C2.68650982,11.0724852 2.32188101,11.704036 1.72997713,12.0457667 L1.72997713,12.0457667 C0.820534984,12.5718952 0.509205679,13.7352837 1.03432495,14.645309 L1.03432495,14.645309 L1.6659039,15.7345539 C1.9126252,16.1797378 2.3265816,16.5082503 2.81617164,16.6473969 C3.30576167,16.7865435 3.83061824,16.7248517 4.27459956,16.4759726 L4.27459956,16.4759726 C4.71105863,16.2212969 5.23116727,16.1515203 5.71931837,16.2821523 C6.20746948,16.4127843 6.62321383,16.7330005 6.87414191,17.1716248 C7.03867571,17.4488473 7.12708702,17.764602 7.13043482,18.0869566 L7.13043482,18.0869566 C7.13043482,19.1435014 7.98693356,20.0000001 9.04347831,20.0000001 L10.2974829,20.0000001 C11.3504633,20.0000001 12.2054882,19.1490783 12.2105264,18.0961099 L12.2105264,18.0961099 C12.2080776,17.5879925 12.4088433,17.0999783 12.7681408,16.7406809 C13.1274382,16.3813834 13.6154524,16.1806176 14.1235699,16.1830664 C14.4451523,16.1916732 14.7596081,16.2797208 15.0389017,16.4393593 L15.0389017,16.4393593 C15.9516813,16.9652957 17.1178937,16.6543057 17.6475973,15.7437072 L17.6475973,15.7437072 L18.3066362,14.645309 C18.5617324,14.2074528 18.6317479,13.6859659 18.5011783,13.1963297 C18.3706086,12.7066935 18.0502282,12.2893121 17.6109841,12.0366133 L17.6109841,12.0366133 C17.17174,11.7839145 16.8513595,11.3665332 16.7207899,10.876897 C16.5902202,10.3872608 16.6602358,9.86577384 16.9153319,9.42791767 C17.0812195,9.13829096 17.3213574,8.89815312 17.6109841,8.73226549 L17.6109841,8.73226549 C18.5161253,8.20284891 18.8263873,7.04344892 18.3066362,6.13272314 L18.3066362,6.13272314 L18.3066362,6.12356982 Z"></path>
        <circle cx="9.675" cy="10.389" r="2.636"></circle>
      </g>
    </svg>`;
    
    // Set the SVG as the button's content
    settingButton.innerHTML = svg;
    // Add click handler for setting button
    settingButton.onclick = (e) => {
      e.stopPropagation(); // Prevent triggering the li click event
      openSettingsModal(testCase);
    
    };
  
    listItem.dataset.fileName = testCase.fileName;
    listItem.dataset.version = testCase.version;
    
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

    // Append elements to list item
    listItem.appendChild(nameSpan);
    listItem.appendChild(settingButton);

    testCaseList.appendChild(listItem);
  });
}

// Initialize the dashboard on page load
document.addEventListener("DOMContentLoaded", function () {
  fetchTestCases();

  const searchBar = document.getElementById("search-bar");
  const statusFilter = document.getElementById("status-filter");
  const categoryFilter = document.getElementById("category-filter");

  // Add event listener for status filter
  statusFilter.addEventListener("change", function() {
    currentFilter = statusFilter.value;
    applyFilters();
  });

  // Add event listener for category filter
  categoryFilter.addEventListener("change", function() {
    currentCategory = categoryFilter.value;
    applyFilters();
  });

  // Function to filter and display test cases based on search input
  searchBar.addEventListener("input", function () {
    applyFilters();
  });
});

// Helper function to apply all filters
function applyFilters() {
  const searchText = document.getElementById("search-bar").value.toLowerCase();
  const searchFiltered = testCases.filter((testCase) =>
    testCase.fileName.toLowerCase().includes(searchText)
  );
  displayTestCases(searchFiltered);
}

// Add this to your fetchTestCases function after loading the test cases
function updateCategoryFilterOptions() {
  const categoryFilter = document.getElementById("category-filter");
  const categories = new Set();
  
  // Add 'all' option
  categories.add('all');
  // Collect all unique categories
  testCases.forEach(testCase => {
    categories.add(testCase.category || 'None');
  });
  
  // Clear existing options
  categoryFilter.innerHTML = '';
  let value = ["all", "Unit Tests","Integration Tests","System Tests","Performance Tests", "Stress Test" ,"Compatibility Tests"]
  let textContent = ["All Categories","Unit Tests","Integration Tests","System Tests" ,"Performance Tests", "Stress Test" ,"Compatibility Tests"]
  let length = value.length;
  for(let i = 0; i< length; i++)
  {
    let option1 = document.createElement('option');
    option1.value = value[i];
    option1.textContent = textContent[i];
    categoryFilter.appendChild(option1);
  }
}


function handleTestCaseComparisonSelection(testCase, isChecked) {
  if (isChecked) {
    if (selectedTestCasesForComparison.length < 2) {
      selectedTestCasesForComparison.push(testCase);
      
      if (selectedTestCasesForComparison.length === 2) {
        compareTestCases(selectedTestCasesForComparison[0], selectedTestCasesForComparison[1]);
        
        // Reset comparison mode
        const listItems = document.querySelectorAll('#test-case-list li');
        listItems.forEach(item => {
          const checkbox = item.querySelector('.comparison-checkbox');
          const settingButton = item.querySelector('.test-case-delete-btn');
          
          if (checkbox) {
            checkbox.style.display = 'none';
            checkbox.checked = false;
          }
          
          if (settingButton) {
            settingButton.style.display = 'block';
          }
        });

        // Reset button text and mode
        const comparisonButton = document.querySelector('.test-case-comparison-btn');
        if (comparisonButton) {
          comparisonButton.textContent = "Enter Comparison Mode";
        }

        selectedTestCasesForComparison = [];
      }
    } else {
      alert("You can only compare two test cases at a time.");
      // Uncheck the checkbox
      const listItems = document.querySelectorAll('#test-case-list li');
      listItems.forEach(item => {
        const checkbox = item.querySelector('.comparison-checkbox');
        if (checkbox) checkbox.checked = false;
      });
      selectedTestCasesForComparison = [];
    }
  } else {
    // Remove the test case from selected cases
    selectedTestCasesForComparison = selectedTestCasesForComparison.filter(
      tc => tc.fileName !== testCase.fileName
    );
  }
}
let comparisonContainer = null;

// Function to compare two test cases
function compareTestCases(testCase1, testCase2) {
  if (!comparisonContainer) {
    comparisonContainer = document.createElement("div");
    comparisonContainer.id = "comparison-container";
    document.body.appendChild(comparisonContainer);
  }
  console.log(comparisonContainer);

  // Clear previous comparison
  comparisonContainer.innerHTML = `
    <div class="comparison-header">
      <h2>Test Case Comparison</h2>
      <button id="close-comparison-btn">Close</button>
    </div>
    <div class="comparison-content">
      <div class="comparison-column">
        <h3>${testCase1.displayFileName}</h3>
        ${generateComparisonHTML(testCase1)}
      </div>
      <div class="comparison-column">
        <h3>${testCase2.displayFileName}</h3>
        ${generateComparisonHTML(testCase2)}
      </div>
    </div>
  `;

  // Add close button functionality
  document.getElementById("close-comparison-btn").addEventListener("click", () => {
    comparisonContainer.style.display = "none";
    
    // Uncheck all checkboxes
    const listItems = document.querySelectorAll('#test-case-list li');
    listItems.forEach(item => {
      const checkbox = item.querySelector('.comparison-checkbox');
      if (checkbox) checkbox.checked = false;
    });
    
    selectedTestCasesForComparison = [];
  });

  comparisonContainer.style.display = "block";
  isComparisonMode = false;
}

// Helper function to generate comparison HTML
function generateComparisonHTML(testCase) {
  // Compare key metrics
  const passRate = (testCase.testResults.testcases.filter(tc => tc.status === "passed").length / testCase.testResults.tests * 100).toFixed(2);
  
  return `
    <div class="comparison-details">
      <p><strong>Created At:</strong> ${testCase.createdAt.split("T")[0]}</p>
      <p><strong>Category:</strong> ${testCase.category || 'No category'}</p>
      <p><strong>Total Tests:</strong> ${testCase.testResults.tests}</p>
      <p><strong>Pass Rate:</strong> ${passRate}%</p>
      <p><strong>Total Time:</strong> ${testCase.testResults.testcases.reduce((sum, tc) => sum + Number(tc.time), 0).toFixed(2)}s</p>
      
      <h4>Test Case Breakdown</h4>
      <table class="comparison-test-breakdown">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          ${testCase.testResults.testcases.map(tc => `
            <tr data-status="${tc.status}">
              <td>${tc.name}</td>
              <td>${tc.status}</td>
              <td>${tc.time}s</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}


