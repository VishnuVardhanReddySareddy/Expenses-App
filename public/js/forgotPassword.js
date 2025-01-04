document
  .getElementById("forgot-password")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const userEmail = document.getElementById("email");
    console.log(userEmail.value);

    try {
      await axios.post("/password/forgotpassword", {
        email: userEmail.value,
      });
    } catch (error) {
      console.error("Error during password reset request:", error);
    }
  });
