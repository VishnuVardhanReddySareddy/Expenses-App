async function handleUserSubmittedData(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const userData = {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  console.log(userData);

  try {
    const response = await axios.post("/signup", userData, {
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 200) {
      alert("User added successfully!");
      event.target.reset();
    } else {
    }
  } catch (error) {
    const errorMsg = document.getElementById("error-msg");

    if (error.response && error.response.data && error.response.data.error) {
      errorMsg.textContent = error.response.data.error;
      errorMsg.style.color = "red";
    } else {
      // Handle other errors (like server error)
      errorMsg.textContent = "Failed to create user, please try again.";
      errorMsg.style.color = "red";
    }
  }
}

document
  .getElementById("signup-form")
  .addEventListener("submit", handleUserSubmittedData);
