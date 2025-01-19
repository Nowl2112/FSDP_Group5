

// let testCases = []; // Declare testCases globally
// let myChart;
// let myChart2;
// let activeTestCase = null; // Track the active test case

// async function fetchTestCases() {
//   const response = await fetch("/test-cases");
//   const allTestCases = await response.json(); // Fetch all test cases
//   const userEmail = localStorage.getItem("email"); // Get email from localStorage

//   // Filter test cases based on user email
//   testCases = allTestCases.filter(testCase => testCase.userEmail === userEmail);

//   const testCaseList = document.getElementById("test-case-list");
//   testCaseList.innerHTML = "";

//   // Initialize a dictionary to track versions
//   const fileNameVersionMap = {};

//   // Process the test cases in reverse order so the latest get higher versions
//   testCases.reverse().forEach((testCase) => {
//     const baseFileName = testCase.fileName;

//     // Check if we've seen this fileName before and increment version if needed
//     if (fileNameVersionMap[baseFileName] == null) {
//       fileNameVersionMap[baseFileName] = 0; // Start with version 0 if it's a new filename
//     } else {
//       fileNameVersionMap[baseFileName] += 1; // Increment version for duplicates
//     }

//     const version = fileNameVersionMap[baseFileName];
//     const displayFileName = version === 0 ? baseFileName : `${baseFileName} (${version})`;

//     testCase.version = version; // Assign version number to the testCase object

//     // Store the modified test case back to the list
//     testCase.displayFileName = displayFileName;
    
//   });

//   // Sort test cases in descending order based on the 'createdAt' field
//   testCases.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Descending order

//   // Display sorted test cases
//   testCases.forEach((testCase) => {
//     const listItem = document.createElement("li");
//     listItem.textContent = testCase.displayFileName;
//     listItem.dataset.fileName = testCase.fileName;
//     listItem.dataset.version = testCase.version;

//     listItem.onclick = () => {
//       // Remove active class from previous selection
//       const previousActive = document.querySelector('#test-case-list li.active');
//       if (previousActive) {
//         previousActive.classList.remove('active');
//       }
      
//       // Add active class to current selection
//       listItem.classList.add('active');
//       activeTestCase = testCase;
      
//       displayTestCaseDetails(testCase);
//     };

//     testCaseList.appendChild(listItem);
//   });
// }

// function displayTestCaseDetails(testCase) {
//   const detailsContainer = document.getElementById("test-case-details");
//   const chartContainer = document.getElementById("chart-container");
//   const chartContainer2 = document.getElementById("chart-container2");

//   // Clear existing details and chart
//   detailsContainer.innerHTML = "";
//   chartContainer.innerHTML = "";

//   // Create elements for general details
//   const fileNameElem = document.createElement("p");
//   fileNameElem.innerHTML = `<strong>File Name:</strong> ${testCase.fileName}`;

//   const createdAtElem = document.createElement("p");
//   const creationDate = testCase.createdAt.split("T")[0]
//   createdAtElem.innerHTML = `<strong>Created At:</strong> ${creationDate}`;

//   const nameElem = document.createElement("p");
//   nameElem.innerHTML = `<strong>Name:</strong> ${
//     testCase.testResults?.name || "No name available"
//   }`;

//   const statsElem = document.createElement("p");
//   statsElem.innerHTML = `<strong>Tests:</strong> ${testCase.testResults.tests}, <strong>Failures:</strong> ${testCase.testResults.failures}, <strong>Errors:</strong> ${testCase.testResults.errors}, <strong>Skipped:</strong> ${testCase.testResults.skipped}`;

//   // Append general details to the container
//   detailsContainer.appendChild(fileNameElem);
//   detailsContainer.appendChild(createdAtElem);
//   detailsContainer.appendChild(nameElem);
//   detailsContainer.appendChild(statsElem);

//   // Create or update the chart based on the test case results
//   if (testCase.testResults && testCase.testResults.testcases) {
//     const passCount = testCase.testResults.testcases.filter(tc => tc.status === "passed").length;
//     const failCount = testCase.testResults.testcases.filter(tc => tc.status === "failed").length;
//     const errorCount = testCase.testResults.testcases.filter(tc => tc.status === "error").length;
//     const skipCount = testCase.testResults.testcases.filter(tc => tc.status !== "passed" && tc.status !== "failed" && tc.status !== "error").length;
//     //Chart 1
//     if (myChart) {
//       myChart.data.datasets[0].data = [passCount, failCount, errorCount, skipCount];
//       myChart.update();
//     } else {
//       myChart = new Chart(chartContainer, {
//         type: 'doughnut',
//         data: {
//           labels: ['Pass', 'Fail', 'Error', 'Skipped'],
//           datasets: [{
//             label: '# of Tests',
//             data: [passCount, failCount, errorCount, skipCount],
//             backgroundColor: ['#9EB384', '#F26853', "#999090", '#e6b400'],
//             borderWidth: 1,
//             color: '#000000',
//           }]
//         },
//         options: {
//           responsive: true,
//           maintainAspectRatio: true,
//           plugins: {
//             customCanvasBackgroundColor: {
//               color: 'lightGreen',
//             },
//             title: {
//               display: true,
//               text: 'Test Case Pass/Fail Chart',
//               color: '#000000',
//             },
//             legend: {
//               labels: {
//                 color: '#000000',
//               }
//             },
//           },
//         }
//       });
//       myChart.canvas.parentNode.style.height = '500px';
//       myChart.canvas.parentNode.style.width = '500px';
//     }


//     //Filtering by names to get unique test cases
//     // const uniqueTestCase = [];
//     // const uniqueNames = new Set();
//     // for(let i = 0; i < Number(testCase.testResults.tests); i++)
//     // {
//     //   let testCaseName = testCase.testResults.testcases[i].name
//     //   if(!uniqueNames.has(testCaseName))
//     //   {
//     //     uniqueNames.add(testCaseName);
//     //     uniqueTestCase.push(testCase.testResults.testcases[i]);
//     //   }
//     // }

//     // for(let i = 0; i < Number(testCase.testResults.tests); i++)
//     //   {
//     //     let testCaseName = testCase.testResults.testcases[i].name
//     //     uniqueNames.forEach(element => {
//     //       if(element == testCaseName)
//     //       {

//     //       }
//     //     });
//     //   }
//     // Dictionary to store unique test cases and their times
//     const uniqueTestCases = {};
//     const avgTimeList = []

//     // Populate the dictionary with test case times
//     for(let i = 0; i < Number(testCase.testResults.tests); i++) {
//       let testCaseName = testCase.testResults.testcases[i].name;
//       let testCaseTime = Number(testCase.testResults.testcases[i].time);

//       if(!uniqueTestCases[testCaseName]) {
//         // If the test case name does not exist, create an array to store the times
//         uniqueTestCases[testCaseName] = [];
//       }

//       // Add the time to the array
//       uniqueTestCases[testCaseName].push(testCaseTime);
//     }

//     // Calculate the average time for each unique test case
//     for(let testCaseName in uniqueTestCases) {
//       const times = uniqueTestCases[testCaseName];
//       const totalTime = times.reduce((acc, time) => acc + time, 0);
//       const averageTime = totalTime / times.length;
//       avgTimeList.push(averageTime);
//       // console.log(`The average time for test case "${testCaseName}" is ${averageTime} seconds.`);
//   }


//     // let uniqueTestCaseTime = uniqueTestCase.map(test =>test.time)

//     //Chart 2
//     if (myChart2) {
//       myChart2.data.datasets[0].data = avgTimeList;
//       myChart2.update();
//     } else {
//       let maxLabelLength = 5; // Maximum length for the labels
//       // let uniqueTestCaseName = uniqueTestCases.map(test => {
//       //   if (test.name.length > maxLabelLength) {
//       //     return test.name.substring(0, maxLabelLength) + '...';
//       //   }
//       //   return test.name;
//       // });
//       let unqiueTestCaseNameList = [];
//       let uniqueNameList = []
//       for(let testCaseName in uniqueTestCases) {
//         uniqueNameList.push(testCaseName);
//         if (testCaseName.length > maxLabelLength) {
//           unqiueTestCaseNameList.push(testCaseName.substring(0, maxLabelLength) + '...');
//         }
//         else
//         {
//           unqiueTestCaseNameList.push(testCaseName);

//         }
//       }

//       myChart2 = new Chart(chartContainer2, {
//         type: 'line',
//         data: {
//           labels: unqiueTestCaseNameList,
//           datasets: [{
//             label: '# of Tests',
//             data: avgTimeList,
//             backgroundColor: ['#9EB384', '#F26853', "#999090", '#e6b400'],
//             borderWidth: 1,
//             color: '#000000',
//           }]
//         },
//         options: {
//           responsive: true,
//           maintainAspectRatio: true,
//           plugins: {
//             customCanvasBackgroundColor: {
//               color: 'lightGreen',
//             },
//             title: {
//               display: true,
//               text: 'Average Time taken for Test Case',
//               color: '#000000',
//             },
//             legend: {
//               labels: {
//                 color: '#000000',
//               }
//             },
//             tooltip:{
//               callbacks:{
//                 label:function(context){
//                   return uniqueNameList[context.dataIndex]
//                 }
//               }
//             }
//           },
//         }
//       });
//       myChart2.canvas.parentNode.style.height = '500px';
//       myChart2.canvas.parentNode.style.width = '500px';
//     }

//   } else {
//     chartContainer.innerHTML = "No test results available.";
//   }

//   // Create the table for test case results
//   const table = document.createElement("table");
//   table.classList.add("test-case-table");
//   table.innerHTML = `
//     <thead>
//       <tr>
//         <th style="text-align: center;">Name</th> 
//         <th style="text-align: center;">Success</th>
//         <th style="text-align: center;">Time</th>
//         <th style="text-align: center;">Summary</th>
//       </tr>
//     </thead>
//     <tbody>
//     </tbody>
//   `;

//   const tbody = table.querySelector("tbody");

//   if (testCase.testResults?.testcases && testCase.testResults.testcases.length > 0) {
//     totalTime = 0;
//     testCase.testResults.testcases.forEach((testCaseResult) => {
//       const lineBreak = document.createElement("br");
//       const row = document.createElement("tr");

//       const nameCell = document.createElement("td");
//       nameCell.textContent = testCaseResult.name;

//       const successCell = document.createElement("td");
//       const img = document.createElement("img");
//       successCell.style.display = "flex";
//       successCell.style.justifyContent = "center";
//       successCell.style.alignItems = "center";
//       successCell.style.height = "110px";
//       successCell.style.padding = "0px";
//       successCell.style.margin = "0px";

//       if (testCaseResult.status === "passed") {
//         img.src = "https://cdn2.iconfinder.com/data/icons/greenline/512/check-512.png";
//         img.alt = "Yes";
//         img.classList.add("success_img");
//       } else {
//         img.src = "https://cdn3.iconfinder.com/data/icons/flat-actions-icons-9/792/Close_Icon_Dark-256.png";
//         img.alt = "No";
//         img.classList.add("failure_img");
//       }
      
//       successCell.appendChild(img);

//       const timeCell = document.createElement("td");
//       timeCell.textContent = testCaseResult.time || "N/A";
//       totalTime += Number(testCaseResult.time);

//       const summaryCell = document.createElement("td");
//       summaryCell.textContent = testCaseResult.summary || "N/A";

//       row.appendChild(nameCell);
//       row.appendChild(successCell);
//       row.appendChild(timeCell);
//       row.appendChild(summaryCell);

//       row.onclick = () => showTestCasePopup(testCaseResult);

//       tbody.appendChild(row);
//       tbody.appendChild(lineBreak);
//     });
//   } else {
//     const noResultsRow = document.createElement("tr");
//     const noResultsCell = document.createElement("td");
//     noResultsCell.colSpan = 4;
//     noResultsCell.textContent = "No test results available";
//     noResultsRow.appendChild(noResultsCell);
//     tbody.appendChild(noResultsRow);
//   }

//   detailsContainer.appendChild(table);
//   document.getElementById("test-case-amount-container").style.display = "flex";
//   const test_case_amount_text = document.getElementById('test-case-amount-text');
//   const passing_rate_text = document.getElementById("passing-rate-text");
//   const avg_time_text = document.getElementById("avg-time-text");

//   const passCount = testCase.testResults.testcases.filter(tc => tc.status === "passed").length;
//   const total_test = Number(testCase.testResults.tests);
//   test_case_amount_text.innerText = total_test;
//   const passingRate = passCount/total_test;
//   passing_rate_text.innerText = (passingRate*100).toFixed(1) + "%";
//   avg_time_text.innerText = (totalTime/total_test).toFixed(2 )+ "s";
// }

// function showTestCasePopup(testCaseResult) {
//   const popupContainer = document.createElement("div");
//   popupContainer.classList.add("popup-container");

//   const popupContent = document.createElement("div");
//   popupContent.classList.add("popup-content");

//   const closeButton = document.createElement("button");
//   closeButton.classList.add("popup-close-btn");
//   closeButton.textContent = "X";

//   const nameElem = document.createElement("p");
//   nameElem.innerHTML = `<strong>Name:</strong> ${testCaseResult.name}`;

//   const statusElem = document.createElement("p");
//   statusElem.innerHTML = `<strong>Status:</strong> ${testCaseResult.status}`;

//   const browserTypeElem = document.createElement("p");
//   browserTypeElem.innerHTML = `<strong>BrowserType:</strong> ${testCaseResult.browserType || "N/A"}`;

//   const timeElem = document.createElement("p");
//   timeElem.innerHTML = `<strong>Time:</strong> ${testCaseResult.time || "N/A"}`;

//   const summaryElem = document.createElement("p");

//   const boldText = document.createElement("strong");
//   boldText.textContent = "Summary:";
//   const normalText = document.createElement("span");
//   normalText.textContent = ` ${testCaseResult.summary || "N/A"}`;
//   summaryElem.appendChild(boldText);
//   summaryElem.appendChild(normalText);



// async function generateSummary(message) {
//   const response = await fetch('/api/generate-summary', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ message })
//   });
  
//   if (!response.ok) {
//     console.error('Error fetching summary');
//     return 'Error fetching summary';
//   }
  
//   const data = await response.json();
//   return data.summary;
// }

// // const normalText = document.createElement("span");

// generateSummary(testCaseResult.message).then(aisummary => {
//   normalText.textContent = aisummary || "N/A";
// });



// // Append both parts to the summary element
// summaryElem.appendChild(boldText);
// summaryElem.appendChild(normalText);




  


//   const messageElem = document.createElement("p");
//   messageElem.innerHTML = `<strong>Error Message:</strong> ${
//     testCaseResult.message || "No message available"
//   }`;

//   popupContent.appendChild(closeButton);
//   popupContent.appendChild(nameElem);
//   popupContent.appendChild(statusElem);
//   popupContent.appendChild(timeElem);
//   popupContent.appendChild(browserTypeElem);
//   popupContent.appendChild(summaryElem);
//   popupContent.appendChild(messageElem);

//   popupContainer.appendChild(popupContent);
//   document.body.appendChild(popupContainer);

//   popupContainer.style.display = "flex";

//   popupContainer.addEventListener("click", function (event) {
//     if (event.target === popupContainer) {
//       popupContainer.style.display = "none";
//     }
//   });

//   closeButton.addEventListener("click", function () {
//     popupContainer.style.display = "none";
//   });
// }

// // Function to display filtered test cases after search
// function displayTestCases(filteredCases) {
//   const testCaseList = document.getElementById("test-case-list");
//   testCaseList.innerHTML = ""; // Clear the list first

//   filteredCases.forEach((testCase) => {
//     const listItem = document.createElement("li");
//     listItem.textContent = testCase.displayFileName;
//     listItem.dataset.fileName = testCase.fileName;
//     listItem.dataset.version = testCase.version;
    
//     // Maintain active state if this is the active test case
//     if (activeTestCase && 
//         activeTestCase.fileName === testCase.fileName && 
//         activeTestCase.version === testCase.version) {
//       listItem.classList.add('active');
//     }
    
//     listItem.onclick = () => {
//       const previousActive = document.querySelector('#test-case-list li.active');
//       if (previousActive) {
//         previousActive.classList.remove('active');
//       }
      
//       listItem.classList.add('active');
//       activeTestCase = testCase;
      
//       displayTestCaseDetails(testCase);
//     };

//     testCaseList.appendChild(listItem);
//   });
// }

// // Initialize the dashboard on page load
// document.addEventListener("DOMContentLoaded", function () {
//   fetchTestCases();

//   const searchBar = document.getElementById("search-bar");
//   const testCaseList = document.getElementById("test-case-list");

//   // Function to filter and display test cases based on search input
//   searchBar.addEventListener("input", function () {
//     const searchText = searchBar.value.toLowerCase();
//     const filteredCases = testCases.filter((testCase) =>
//       testCase.fileName.toLowerCase().includes(searchText)
//     );
//     displayTestCases(filteredCases);
//   });
// });

let testCases = []; // Declare testCases globally
let myChart;
let myChart2;
let activeTestCase = null; // Track the active test case
let currentFilter = 'all'; // Track current status filter

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
  displayFilteredTestCases(testCases);
}

function filterTestCasesByStatus(testCase) {
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

// Close modal when clicking outside
// window.onclick = (event) => {
//   const modal = document.getElementById("settings-modal");
//   if (event.target === modal) {
//     modal.style.display = "none";
//   }
// };



function displayFilteredTestCases(cases) {
  const filteredCases = cases.filter(filterTestCasesByStatus);
  const testCaseList = document.getElementById("test-case-list");
  testCaseList.innerHTML = "";

  filteredCases.forEach((testCase) => {
    const listItem = createTestCaseListItem(testCase);
    testCaseList.appendChild(listItem);
  });
}

function displayTestCases(filteredCases) {
  const testCaseList = document.getElementById("test-case-list");
  testCaseList.innerHTML = "";

  // Apply both search filter and status filter
  const statusFilteredCases = filteredCases.filter(filterTestCasesByStatus);

  statusFilteredCases.forEach((testCase) => {
    const listItem = createTestCaseListItem(testCase);
    testCaseList.appendChild(listItem);
  });
}

function displayTestCaseDetails(testCase) {
  const detailsContainer = document.getElementById("test-case-details");
  const chartContainer = document.getElementById("chart-container");
  const chartContainer2 = document.getElementById("chart-container2");

  detailsContainer.innerHTML = "";
  chartContainer.innerHTML = "";

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

  // Apply both search filter and status filter
  const statusFilteredCases = filteredCases.filter(filterTestCasesByStatus);

  statusFilteredCases.forEach((testCase) => {
    const listItem = document.createElement("li");
    
    // Create span for test case name
    const nameSpan = document.createElement("span");
    nameSpan.textContent = testCase.displayFileName;
    nameSpan.className = "test-case-name";
    
    // Create delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "test-case-delete-btn";
    
    // Add click handler for delete button
    deleteButton.onclick = (e) => {
      e.stopPropagation(); // Prevent triggering the li click event
      if (confirm(`Are you sure you want to delete ${testCase.displayFileName}?`)) {
        // Add your delete functionality here
        console.log(`Deleting test case: ${testCase.displayFileName}`);
        // You would typically make an API call here to delete the test case
      }
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
    listItem.appendChild(deleteButton);

    testCaseList.appendChild(listItem);
  });
}

// Initialize the dashboard on page load
document.addEventListener("DOMContentLoaded", function () {
  fetchTestCases();

  const searchBar = document.getElementById("search-bar");
  const statusFilter = document.getElementById("status-filter");

  // Add event listener for status filter
  statusFilter.addEventListener("change", function() {
    currentFilter = statusFilter.value;
    const searchText = searchBar.value.toLowerCase();
    const searchFiltered = testCases.filter((testCase) =>
      testCase.fileName.toLowerCase().includes(searchText)
    );
    displayTestCases(searchFiltered);
  });

  // Function to filter and display test cases based on search input
  searchBar.addEventListener("input", function () {
    const searchText = searchBar.value.toLowerCase();
    const filteredCases = testCases.filter((testCase) =>
      testCase.fileName.toLowerCase().includes(searchText)
    );
    displayTestCases(filteredCases);
  });
});