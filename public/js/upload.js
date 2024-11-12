//Handle running test
async function runTest(content, nameOfFile) {
  try {
    const userEmail = localStorage.getItem("email"); // Retrieve the email from localStorage

    // Check if email exists in localStorage
    if (!userEmail) {
      console.error("User email is not available in localStorage");
      return;
    }

    const response = await fetch("/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: content,
        name: nameOfFile,
        userEmail: userEmail,
      }), // Include userEmail
    });

    const result = await response.json();
    console.log(result);
  } catch (err) {
    console.error(err);
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
      content2 = event.target.result;
      // Now content2 is ready, enable the test button or directly call runTest
      console.log("File content loaded", content2);
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
  if (content2 != "" && fileName2 != "") {
    runTest(content2, fileName2);
  }
  fileInput.value = "";
  fileName.textContent = "";
  content2 = "";
  fileName2 = "";
});

//
