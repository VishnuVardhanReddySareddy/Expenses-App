window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const isPremiumUser = localStorage.getItem("ispremiumuser") === "true";

  if (isPremiumUser) {
    document.getElementById("rzp-button").style.display = "none";
    document.getElementById("premium-user").textContent =
      "You are a Premium Member Now!";
    document.getElementById("show-leaderboard").style.display = "block";
  } else {
    document.getElementById("premium-user").textContent = "";
  }

  axios
    .get("/get-expenses", { headers: { authorization: token } })
    .then((response) => {
      response.data.forEach((expense) => displayExpenseOnScreen(expense));
    })
    .catch((error) => console.log("Error fetching expenses:", error.message));
});

async function addExpenseData(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const expenseData = {
    price: parseFloat(formData.get("price")),
    product: formData.get("product"),
    category: formData.get("category"),
  };
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post("/add-expense", expenseData, {
      headers: { "Content-Type": "application/json", authorization: token },
    });

    if (response.status === 200) {
      displayExpenseOnScreen(response.data);
      event.target.reset();
    }
  } catch (error) {
    console.log(error);
  }
}

function displayExpenseOnScreen(expense) {
  const ul = document.getElementById("list-items");
  const expenseItem = document.createElement("li");
  expenseItem.id = expense.id;

  expenseItem.innerHTML = `${expense.price} - ${expense.product} - ${expense.category} <button>Delete</button>`;

  const deleteButton = expenseItem.querySelector("button");
  deleteButton.addEventListener("click", function (event) {
    deleteExpense(event, expense.id);
  });

  ul.appendChild(expenseItem);
}

async function deleteExpense(event, expenseId) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.delete(`/delete-expense/${expenseId}`, {
      headers: { authorization: token },
    });

    if (response.status === 200) {
      removeFromUI(expenseId);
    }
  } catch (error) {
    console.log(error);
  }
}

function removeFromUI(id) {
  document.getElementById(id).remove();
}

document.getElementById("rzp-button").onclick = async function (e) {
  const token = localStorage.getItem("token");

  const response = await axios.get("/premiummembership", {
    headers: { authorization: token },
  });
  console.log("Razorpay order response:", response);

  var options = {
    key: response.data.key_id, // Enter the Key ID generated from the Dashboard
    order_id: response.data.order.id, // For one-time payment

    // This handler function will handle the success payment
    handler: async function (response) {
      console.log("Payment successful:", response);
      try {
        const updateResponse = await axios.post(
          "/updatetransactionstatus",
          {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
          },
          {
            headers: { Authorization: token },
          }
        );
        console.log("Transaction updated successfully:", updateResponse);

        // Ensure the new token is stored in local storage
        localStorage.setItem("token", updateResponse.data.token);
        localStorage.setItem("ispremiumuser", true);

        // Show the alert
        alert("You are a Premium User Now");

        // DOM manipulation to hide the Buy Premium button and show a message
        document.getElementById("rzp-button").style.display = "none";
        const premiumUserMessage = document.getElementById("premium-user");
        premiumUserMessage.textContent = "You are a Premium Member Now!";
      } catch (error) {
        console.log("Error updating transaction:", error);
      }
    },
  };

  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on("payment.failed", async function (response) {
    console.log("Payment failed:", response);

    try {
      await axios.post(
        "/updatetransactionstatus",
        {
          order_id: options.order_id,
        },
        {
          headers: { Authorization: token },
        }
      );
      console.log("Failed transaction updated in the database");
    } catch (error) {
      console.log("Error updating failed transaction:", error);
    }

    alert(`Payment Failed: ${response.error.description}`);
  });
};

document.getElementById("show-leaderboard").onclick = async function () {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get("/premium/showleaderboard", {
      headers: { authorization: token },
    });
    const leaderboard = response.data;
    const leaderboardDiv = document.getElementById("leaderboard");
    leaderboardDiv.innerHTML = "<h2>Leaderboard</h2>";
    leaderboard.forEach((user) => {
      const userDiv = document.createElement("div");
      userDiv.textContent = `Name: ${user.name}'s Total Expenses : ${user.total_spent}`;
      leaderboardDiv.appendChild(userDiv);
    });
  } catch (error) {
    console.log("Error fetching leaderboard:", error.message);
  }
};

document
  .getElementById("expense-table")
  .addEventListener("submit", addExpenseData);
