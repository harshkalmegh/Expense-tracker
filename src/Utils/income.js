const incomeColors = [
  "#123123",
  "#154731",
  "#165f40",
  "#16784f",
  "#14915f",
  "#10ac6e",
  "#0bc77e",
  "#04e38d",
  "#00ff9d",
];

const incomeCategories = [
  { type: "Business", amount: 0, color: incomeColors[0] },
  { type: "Investments", amount: 0, color: incomeColors[1] },
  { type: "Extra income", amount: 0, color: incomeColors[2] },
  { type: "Deposits", amount: 0, color: incomeColors[3] },
  { type: "Lottery", amount: 0, color: incomeColors[4] },
  { type: "Gifts", amount: 0, color: incomeColors[5] },
  { type: "Salary", amount: 0, color: incomeColors[6] },
  { type: "Savings", amount: 0, color: incomeColors[7] },
  { type: "Rental income", amount: 0, color: incomeColors[8] },
];

const resetCategories = () => {
  incomeCategories.forEach((c) => (c.amount = 0));
};

const income = (transactions) => {
  resetCategories();
  const rightTransactions = transactions.filter((t) => t.type === "Income");

  rightTransactions.forEach((t) => {
    const category = incomeCategories.find((c) => c.type === t.source);
    if (category) category.amount += +t.amount;
  });

  const filteredCategories = incomeCategories.filter((sc) => sc.amount > 0);

  return filteredCategories;
};

export default income;
