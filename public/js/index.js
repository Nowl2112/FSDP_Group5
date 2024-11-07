const login_button = document.getElementById("login-button");

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  }).then((res) => {
    res.json();
    if (res.ok) {
      localStorage.setItem("email", email);
      window.location.href = "homepage.html";
    } else {
      window.alert("Incorrect credentials");
    }
  });
}

login_button.addEventListener("click", (e) => {
  e.preventDefault();
  login();
  document.getElementById("login-form").reset();
});
