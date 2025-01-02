async function handleUserSubmittedData(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const userData = {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  try {
    const response = await axios.post("/signup", userData, {
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 200 || response.status === 201) {
      window.location.href = "./login.html";
      alert("User added successfully!");
    }
  } catch (error) {
    const errorMsg = document.getElementById("error-msg");
    console.log(error);
    errorMsg.textContent = error.response.data.error;
    errorMsg.style.color = "red";
  }
}

document
  .getElementById("signup-form")
  .addEventListener("submit", handleUserSubmittedData);
