// setTimeout(function() {
//   document.getElementById('loader').style.display = 'none';
// }, 100000);

//Handle running test
// async function runTest(content, nameOfFile) {
//   try {
//     const userEmail = localStorage.getItem("email"); // Retrieve the email from localStorage

//     // Check if email exists in localStorage
//     if (!userEmail) {
//       console.error("User email is not available in localStorage");
//       return;
//     }

//     const response = await fetch("/upload", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         content: content,
//         name: nameOfFile,
//         userEmail: userEmail,
//       }), // Include userEmail
//     });

//     const result = await response.json();
//     console.log(result);
//   } catch (err) {
//     console.error(err);
//   }
// }

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
document.getElementById("scheduleTestBtn").addEventListener("click", async () => {
  const fileInput = document.getElementById("fileInput");
  const scheduleTime = document.getElementById("scheduleTime").value;
  const userEmail = localStorage.getItem("email"); // Retrieve email from localStorage

  if (!fileInput.files || fileInput.files.length === 0) {
    alert("Please select a file to upload.");
    return;
  }

  if (!scheduleTime) {
    alert("Please select a scheduled time.");
    return;
  }

  if (!userEmail) {
    alert("User email is not available. Please log in again.");
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = async function (event) {
    const fileContent = event.target.result;
    const fileName = file.name;

    try {
      const response = await fetch("/upload-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: fileContent,
          name: fileName,
          userEmail: userEmail,
          scheduleTime: new Date(scheduleTime).toISOString(),
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert(`Test scheduled successfully for ${scheduleTime}`);
      } else {
        alert(`Error scheduling test: ${result.message}`);
      }
    } catch (error) {
      console.error("Error scheduling test:", error);
      alert("Failed to schedule test. Please try again.");
    }
  };

  reader.readAsText(file);
});
=======




