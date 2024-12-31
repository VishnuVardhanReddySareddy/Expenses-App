async function addExpenseData(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const expenseData = {
    price: parseFloat(formData.get("price")),
    product: formData.get("product"),
    category: formData.get("category"),
  };

  try {
    const response = await axios.post("/add-expense", expenseData, {
      headers: { "Content-Type": "application/json" },
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
  expenseItem.appendChild(
    document.createTextNode(
      `${expense.price} - ${expense.product} - ${expense.category}`
    )
  );
  ul.appendChild(expenseItem);
}

document
  .getElementById("expense-table")
  .addEventListener("submit", addExpenseData);
