const upload_button = document.getElementById("upload_button");

upload_button.addEventListener("click", (e) => {
  window.location.href = "upload.html";
});
const email = localStorage.getItem("email");
const userNameElement = document.querySelector(".user-name");
userNameElement.textContent = email;
