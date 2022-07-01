const expenseColors = [
  "#b50d12",
  "#bf2f1f",
  "#c9452c",
  "#d3583a",
  "#dc6a48",
  "#e57c58",
  "#ee8d68",
  "#f79d79",
  "#ffae8a",
  "#cc474b",
  "#f55b5f",
];
const expenseCategories = [
  { type: "Bills", amount: 0, color: expenseColors[0] },
  { type: "Car", amount: 0, color: expenseColors[1] },
  { type: "Clothes", amount: 0, color: expenseColors[2] },
  { type: "Travel", amount: 0, color: expenseColors[3] },
  { type: "Food", amount: 0, color: expenseColors[4] },
  { type: "Shopping", amount: 0, color: expenseColors[5] },
  { type: "House", amount: 0, color: expenseColors[6] },
  { type: "Entertainment", amount: 0, color: expenseColors[7] },
  { type: "Phone", amount: 0, color: expenseColors[8] },
  { type: "Pets", amount: 0, color: expenseColors[9] },
  { type: "Other", amount: 0, color: expenseColors[10] },
];
const resetCategories = () => {
  expenseCategories.forEach((c) => (c.amount = 0));
};

const expense = (transactions) => {
  resetCategories();
  const rightTransactions = transactions.filter((t) => t.type === "Expense");

  rightTransactions.forEach((t) => {
    const category = expenseCategories.find((c) => c.type === t.source);
    if (category) category.amount += +t.amount;
  });

  const filteredCategories = expenseCategories.filter((sc) => sc.amount > 0);

  return filteredCategories;
};

export default expense;
