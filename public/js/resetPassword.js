document.getElementById("reset-password-form").addEventListener("submit", async (event) => {
    event.preventDefault();
  
    const newPassword = document.getElementById("password").value;
    const resetId = document.getElementById("reset-id").value;
    console.log(newPassword);
  
    try {
      const response = await axios.post(`/password/updatepassword/${resetId}`, {
        password: newPassword
      });
      console.log(response.data.message); // Log success message
      alert(response.data.message); // Show success message to user
      document.getElementById("password").value = ''; // Clear the input field
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Something went wrong. Please try again.");
    }
  });
  