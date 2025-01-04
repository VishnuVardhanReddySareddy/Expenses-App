document
  .getElementById("forgot-password")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const userEmail = document.getElementById("email").value;
    console.log("User Email: ", userEmail);

    try {
      const response = await axios.post("/password/forgotpassword", {
        email: userEmail
      });
      console.log(response.data.message); // Log success message
      alert(response.data.message); // Show success message to user
    } catch (error) {
      console.error("Error during password reset request:", error);
      alert("Something went wrong. Please try again.");
    }
  });
