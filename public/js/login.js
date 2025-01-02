async function handleLoginData(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const loginData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  try {
    const response = await axios.post("/login", loginData, {
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 200) {
      localStorage.setItem("token", response.data.token);

      window.location.href = "/add-expense";
    }
  } catch (error) {
    const errorMsg = document.getElementById("login-error-msg");

    if (error.response && error.response.data && error.response.data.error) {
      errorMsg.textContent = error.response.data.error;
      errorMsg.style.color = "red";
    } else {
      errorMsg.textContent = "Failed to login, please try again.";
      errorMsg.style.color = "red";
    }
  }
}

document
  .getElementById("login-form")
  .addEventListener("submit", handleLoginData);
