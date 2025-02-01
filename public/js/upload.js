
const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const fileName = document.getElementById("fileName");
const testButton = document.getElementById("test-btn");
const loader = document.getElementById('loader');
const backgroundBlur = document.getElementById('backdrop-overlay')
var fileName2;
var content2;
// Handle file selection
fileInput.addEventListener("change", function (e) {
  if (this.files && this.files[0]) {
    fileName.textContent = `Selected file: ${this.files[0].name}`;
    const nameOfFile = this.files[0].name;
    fileName2 = nameOfFile;
    const reader = new FileReader();

    reader.onload = async function (event) {
      content2 = event.target.result;
      // Now content2 is ready, enable the test button or directly call runTest
      // console.log("File content loaded", content2);
    };

    reader.readAsText(this.files[0]);
  }
});

// Handle drag and drop
dropZone.addEventListener("dragover", function (e) {
  e.preventDefault();
  this.classList.add("dragover");
});

dropZone.addEventListener("dragleave", function (e) {
  e.preventDefault();
  this.classList.remove("dragover");
});

dropZone.addEventListener("drop", function (e) {
  e.preventDefault();
  this.classList.remove("dragover");

  const files = e.dataTransfer.files;
  if (files && files[0]) {
    fileInput.files = files;
    fileName.textContent = `Selected file: ${files[0].name}`;
  }
});

// Handle click on the drop zone
dropZone.addEventListener("click", function (e) {
  if (e.target === this || e.target.tagName !== "BUTTON") {
    fileInput.click();
  }
});

//Havnet fully test yet
testButton.addEventListener("click", function (e) {
  e.preventDefault();
  
  if (content2 != "" && fileName2 != "" && content2 != undefined && fileName != undefined) {
    const fileExtension = fileName2.split(".");
    if(fileExtension[1] == "java")
    {
      runTest(content2, fileName2);
      fileInput.value = undefined
      fileName.textContent = undefined
      content2 = undefined
      fileName2 = undefined
    }
    else
    {
      const errorModal = document.getElementById("errorModal");
      const errorMessage = document.getElementById("errorMessage");
      errorMessage.textContent = "File input is not a java file";
      errorModal.style.display = "flex";
      document.getElementById("errorTryAgainBtn").addEventListener("click", () => {
      errorModal.style.display = "none";
      });
    }
  }
  else
  {
    const errorModal = document.getElementById("errorModal");
    const errorMessage = document.getElementById("errorMessage");
    errorMessage.textContent = "No File Input";
    errorModal.style.display = "flex";
    document.getElementById("errorTryAgainBtn").addEventListener("click", () => {
    errorModal.style.display = "none";
    });
  }
 
});

//
// Show success modal after a successful test
function showSuccessModal() {
  const successModal = document.getElementById("successModal");
  successModal.style.display = "flex"; // Show the modal as flex to center it

  // Add event listeners for buttons
  document.getElementById("uploadMoreBtn").addEventListener("click", () => {
    successModal.style.display = "none"; // Close modal
  });

  document.getElementById("viewResultsBtn").addEventListener("click", () => {
    window.location.href = "dashboard.html"; // Redirect to dashboard
  });
}

// Call showSuccessModal() after a successful response in runTest()
async function runTest(content, nameOfFile) {
  try {
    
      backgroundBlur.style.display = "block";
      loader.style.display = "block";
      const userEmail = localStorage.getItem("email");
  
      if (!userEmail) {
        console.error("User email is not available in localStorage");
        return;
      }
  
      const response = await fetch("/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, name: nameOfFile, userEmail }),
      });
  
      const result = await response.json();
      console.log(result);
  
  
      // Show success modal on successful response
      if (response.ok)
        {
          backgroundBlur.style.display = "none";
          loader.style.display = "none";
  
          showSuccessModal();
        }
  } catch (err) {
    
    console.error(err);
  }
}
// document.getElementById("scheduleTestBtn").addEventListener("click", async () => {
//   const fileInput = document.getElementById("fileInput");
//   const scheduleTime = document.getElementById("scheduleTime").value;
//   const userEmail = localStorage.getItem("email"); // Retrieve email from localStorage

//   if (!fileInput.files || fileInput.files.length === 0) {
//     alert("Please select a file to upload.");
//     return;
//   }

//   if (!scheduleTime) {
//     alert("Please select a scheduled time.");
//     return;
//   }

//   if (!userEmail) {
//     alert("User email is not available. Please log in again.");
//     return;
//   }

//   const file = fileInput.files[0];
//   const reader = new FileReader();

//   reader.onload = async function (event) {
//     const fileContent = event.target.result;
//     const fileName = file.name;

//     try {
//       const response = await fetch("/upload-schedule", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           content: fileContent,
//           name: fileName,
//           userEmail: userEmail,
//           scheduleTime: new Date(scheduleTime).toISOString(),
//         }),
//       });

//       const result = await response.json();
//       if (response.ok) {
//         alert(`Test scheduled successfully for ${scheduleTime}`);
//       } else {
//         alert(`Error scheduling test: ${result.message}`);
//       }
//     } catch (error) {
//       console.error("Error scheduling test:", error);
//       alert("Failed to schedule test. Please try again.");
//     }
//   };

//   reader.readAsText(file);
// });

// document.getElementById("scheduleDailyTestBtn").addEventListener("click", async () => {
//   const fileInput = document.getElementById("fileInput");
//   const executionTime = document.getElementById("dailyExecutionTime").value;
//   const userEmail = localStorage.getItem("email");

//   if (!fileInput.files || fileInput.files.length === 0) {
//     alert("Please select a file to upload.");
//     return;
//   }

//   if (!executionTime) {
//     alert("Please select an execution time for daily tests.");
//     return;
//   }

//   if (!userEmail) {
//     alert("User email is not available. Please log in again.");
//     return;
//   }

//   const file = fileInput.files[0];
//   const reader = new FileReader();

//   reader.onload = async function (event) {
//     const fileContent = event.target.result;
//     const fileName = file.name;

//     try {
//       backgroundBlur.style.display = "block";
//       loader.style.display = "block";

//       const response = await fetch("/schedule-daily-test", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           content: fileContent,
//           name: fileName,
//           userEmail: userEmail,
//           executionTime: executionTime
//         }),
//       });

//       const result = await response.json();
      
//       if (response.ok) {
//         backgroundBlur.style.display = "none";
//         loader.style.display = "none";
//         alert(`Daily test scheduled successfully to run at ${executionTime} every day`);
//       } else {
//         alert(`Error scheduling daily test: ${result.message}`);
//       }
//     } catch (error) {
//       console.error("Error scheduling daily test:", error);
//       alert("Failed to schedule daily test. Please try again.");
//     }
//   };

//   reader.readAsText(file);
// });

// Add to upload.js
// let scheduleType = 'one-time'; // Default to one-time schedule

// document.getElementById('scheduleTypeToggle').addEventListener('change', function() {
//   scheduleType = this.checked ? 'daily' : 'one-time';
  
//   // Update UI based on schedule type
//   const oneTimeFields = document.getElementById('oneTimeScheduleFields');
//   const dailyFields = document.getElementById('dailyScheduleFields');
  
//   if (scheduleType === 'one-time') {
//     oneTimeFields.style.display = 'block';
//     dailyFields.style.display = 'none';
//   } else {
//     oneTimeFields.style.display = 'none';
//     dailyFields.style.display = 'block';
//   }
// });

// document.getElementById('scheduleTestBtn').addEventListener('click', async () => {
//   const fileInput = document.getElementById('fileInput');
//   const userEmail = localStorage.getItem('email');
  
//   if (!fileInput.files || fileInput.files.length === 0) {
//     alert('Please select a file to upload.');
//     return;
//   }

//   if (!userEmail) {
//     alert('User email is not available. Please log in again.');
//     return;
//   }

//   let scheduleTime;
//   if (scheduleType === 'one-time') {
//     scheduleTime = document.getElementById('oneTimeSchedule').value;
//     if (!scheduleTime) {
//       alert('Please select a schedule time.');
//       return;
//     }
//   } else {
//     scheduleTime = document.getElementById('dailyExecutionTime').value;
//     if (!scheduleTime) {
//       alert('Please select a daily execution time.');
//       return;
//     }
//   }

  
//   const file = fileInput.files[0];
//   const reader = new FileReader();

//   reader.onload = async function(event) {
//     const fileContent = event.target.result;
//     const fileName = file.name;

//     try {
//       backgroundBlur.style.display = 'block';
//       loader.style.display = 'block';

//       const endpoint = scheduleType === 'one-time' ? '/upload-schedule' : '/schedule-daily-test';
//       const body = {
//         content: fileContent,
//         name: fileName,
//         userEmail: userEmail,
//         scheduleTime: scheduleType === 'one-time' ? 
//           new Date(scheduleTime).toISOString() : 
//           scheduleTime
//       };

//       const response = await fetch(endpoint, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(body)
//       });

//       const result = await response.json();

//       if (response.ok) {
//         alert(scheduleType === 'one-time' ? 
//           `Test scheduled for ${new Date(scheduleTime).toLocaleString()}` :
//           `Daily test scheduled to run at ${scheduleTime}`
//         );
//         if (scheduleType === 'daily') {
//           loadDailyTests(); // Refresh daily tests list if it's a daily test
//         }
//       } else {
//         alert(`Error scheduling test: ${result.message}`);
//       }
//     } catch (error) {
//       console.error('Error scheduling test:', error);
//       alert('Failed to schedule test. Please try again.');
//     } finally {
//       backgroundBlur.style.display = 'none';
//       loader.style.display = 'none';
//     }
//   };

//   reader.readAsText(file);
// });

// // Function to load and display existing daily tests
// async function loadDailyTests() {
//   const userEmail = localStorage.getItem("email");
//   if (!userEmail) return;

//   try {
//     const response = await fetch(`/daily-tests/${userEmail}`);
//     const dailyTests = await response.json();

//     const dailyTestsList = document.getElementById("dailyTestsList");
//     dailyTestsList.innerHTML = "";

//     dailyTests.forEach(test => {
//       const testElement = document.createElement("div");
//       testElement.className = "daily-test-item";
//       testElement.innerHTML = `
//         <span>${test.fileName} - Runs daily at ${test.executionTime}</span>
//         <button onclick="cancelDailyTest('${test._id}')" class="cancel-btn">Cancel</button>
//       `;

//       const cancelBtn = testElement.querySelector('.cancel-btn');
//       cancelBtn.addEventListener('click', () => cancelDailyTest(test._id));
      
//       dailyTestsList.appendChild(testElement);
//     });
//   } catch (error) {
//     console.error("Error loading daily tests:", error);
//   }
// }

// // Function to cancel a daily test
// async function cancelDailyTest(testId) {
//   try {
//     const response = await fetch(`/daily-tests/${testId}`, {
//       method: "DELETE"
//     });

//     if (response.ok) {
//       alert("Daily test cancelled successfully");
//       loadDailyTests(); // Refresh the list
//     } else {
//       alert("Failed to cancel daily test");
//     }
//   } catch (error) {
//     console.error("Error cancelling daily test:", error);
//     alert("Error cancelling daily test");
//   }
// }

// document.addEventListener("DOMContentLoaded", loadDailyTests);


document.addEventListener('DOMContentLoaded', function() {
  const scheduleTypeToggle = document.getElementById('scheduleTypeToggle');
  const oneTimeScheduleFields = document.getElementById('oneTimeScheduleFields');
  const dailyScheduleFields = document.getElementById('dailyScheduleFields');
  const oneTimeLabel = document.getElementById('oneTimeLabel');
  const dailyLabel = document.getElementById('dailyLabel');
  const backgroundBlur = document.getElementById('backdrop-overlay');
  const loader = document.getElementById('loader');

  let scheduleType = 'one-time'; // Default to one-time schedule

  // Initial setup
  loadDailyTests();
  setupDateTimeMinimum();

  scheduleTypeToggle.addEventListener('change', function() {
      scheduleType = this.checked ? 'daily' : 'one-time';
      
      if (this.checked) {
          // Daily mode
          oneTimeScheduleFields.style.display = 'none';
          dailyScheduleFields.style.display = 'block';
          oneTimeLabel.classList.remove('active-option');
          dailyLabel.classList.add('active-option');
      } else {
          // One-time mode
          oneTimeScheduleFields.style.display = 'block';
          dailyScheduleFields.style.display = 'none';
          oneTimeLabel.classList.add('active-option');
          dailyLabel.classList.remove('active-option');
      }
  });

  document.getElementById('scheduleTestBtn').addEventListener('click', async () => {
      const fileInput = document.getElementById('fileInput');
      const userEmail = localStorage.getItem('email');
      
      if (!fileInput.files || fileInput.files.length === 0) {
          alert('Please select a file to upload.');
          return;
      }

      if (!userEmail) {
          alert('User email is not available. Please log in again.');
          return;
      }

      let scheduleTime;
      if (scheduleType === 'one-time') {
          scheduleTime = document.getElementById('oneTimeSchedule').value;
          if (!scheduleTime) {
              alert('Please select a schedule time.');
              return;
          }
      } else {
          scheduleTime = document.getElementById('dailyExecutionTime').value;
          if (!scheduleTime) {
              alert('Please select a daily execution time.');
              return;
          }
      }

      const file = fileInput.files[0];
      const reader = new FileReader();

      reader.onload = async function(event) {
          const fileContent = event.target.result;
          const fileName = file.name;

          try {
              backgroundBlur.style.display = 'block';
              loader.style.display = 'block';

              const endpoint = scheduleType === 'one-time' ? '/upload-schedule' : '/schedule-daily-test';
              const body = {
                  content: fileContent,
                  name: fileName,
                  userEmail: userEmail,
                  scheduleTime: scheduleType === 'one-time' ? 
                      new Date(scheduleTime).toISOString() : 
                      scheduleTime
              };

              const response = await fetch(endpoint, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(body)
              });

              const result = await response.json();

              if (response.ok) {
                  alert(scheduleType === 'one-time' ? 
                      `Test scheduled for ${new Date(scheduleTime).toLocaleString()}` :
                      `Daily test scheduled to run at ${scheduleTime}`
                  );
                  if (scheduleType === 'daily') {
                      loadDailyTests();
                  }
              } else {
                  alert(`Error scheduling test: ${result.message}`);
              }
          } catch (error) {
              console.error('Error scheduling test:', error);
              alert('Failed to schedule test. Please try again.');
          } finally {
              backgroundBlur.style.display = 'none';
              loader.style.display = 'none';
          }
      };

      reader.readAsText(file);
  });

  // Function to load and display existing daily tests
  async function loadDailyTests() {
      const userEmail = localStorage.getItem("email");
      if (!userEmail) return;

      try {
          const response = await fetch(`/daily-tests/${userEmail}`);
          const dailyTests = await response.json();

          const dailyTestsList = document.getElementById("dailyTestsList");
          if (!dailyTestsList) return;
          
          dailyTestsList.innerHTML = "";
          dailyTestsList.style.display = dailyTests.length ? 'block' : 'none';

          dailyTests.forEach(test => {
              const testElement = document.createElement("div");
              testElement.className = "daily-test-item";
              testElement.innerHTML = `
                  <span>${test.fileName} - Runs daily at ${test.scheduleTime}</span>
                  <button class="cancel-btn">Cancel</button>
              `;

              const cancelBtn = testElement.querySelector('.cancel-btn');
              cancelBtn.addEventListener('click', () => cancelDailyTest(test._id));
              
              dailyTestsList.appendChild(testElement);
          });
      } catch (error) {
          console.error("Error loading daily tests:", error);
      }
  }


  // Set minimum datetime for one-time schedule
  function setupDateTimeMinimum() {
      const oneTimeSchedule = document.getElementById('oneTimeSchedule');
      if (oneTimeSchedule) {
          const now = new Date();
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, '0');
          const day = String(now.getDate()).padStart(2, '0');
          const hours = String(now.getHours()).padStart(2, '0');
          const minutes = String(now.getMinutes()).padStart(2, '0');
          
          oneTimeSchedule.min = `${year}-${month}-${day}T${hours}:${minutes}`;
      }
  }
});

  // Function to cancel a daily test
  async function cancelDailyTest(testId) {
    try {
        const response = await fetch(`/daily-tests/${testId}`, {
            method: "DELETE",
            headers: { 'Content-Type': 'application/json' },

        });

        if (response.ok) {
            alert("Daily test cancelled successfully");
            loadDailyTests();
        } else {
            alert("Failed to cancel daily test");
        }
    } catch (error) {
        console.error("Error cancelling daily test:", error);
        // alert("Error cancelling daily test");
    }
}
