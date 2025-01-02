window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
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
document
  .getElementById("expense-table")
  .addEventListener("submit", addExpenseData);
