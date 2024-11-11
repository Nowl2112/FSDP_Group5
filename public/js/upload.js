async function runTest(content, nameOfFile) {
  try {
    const userEmail = localStorage.getItem("email");

    if (!userEmail) {
      console.error("User email is missing in localStorage.");
      return;
    }

    const response = await fetch("/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: content,
        name: nameOfFile,
        userEmail: userEmail,
      }),
    });

    const result = await response.json();
    console.log(result); // Add this line to see the response in the console

    // Check if the request was successful
    if (response.ok) {
      // Display success message
      const messageBox = document.getElementById("messageBox");
      messageBox.textContent =
        result.message || "Test case uploaded successfully!";
      messageBox.style.backgroundColor = "green"; // Change background to green for success
      messageBox.style.display = "block"; // Show message box

      // Optionally hide the message after a few seconds
      setTimeout(() => {
        messageBox.style.display = "none";
      }, 5000);
    } else {
      // Handle error
      alert(result.message || "Failed to upload test case.");
    }
  } catch (err) {
    console.error("Error in runTest:", err);
    alert("An error occurred while uploading the test case.");
  }
}

const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const fileName = document.getElementById("fileName");
const testButton = document.getElementById("test-btn");
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
      const content = event.target.result;
      content2 = content;
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

<<<<<<< HEAD
//Havnet fully test yet
testButton.addEventListener('click', function(e) {
    
    e.preventDefault();
    if(content2 != '' && fileName2 != '')
    {
        runTest(content2,fileName2);
    }
    fileInput.value = '';
    fileName.textContent = '';
    content2 = '';
    fileName2 = '';

=======
testButton.addEventListener("click", function (e) {
  e.preventDefault();
  runTest(content2, fileName2);
  fileInput.value = "";
  fileName.textContent = "";
>>>>>>> 08bc5303e13fb9dca6bb59083e74b74815fa516d
});

//
