import {
  incomeCategories,
  expenseCategories,
  resetCategories,
} from "./categories";

const useTransactions = (title, transactions) => {
  resetCategories();
  const rightTransactions = transactions.filter((t) => t.type === title);
  const total = rightTransactions.reduce(
    (acc, currVal) => (acc += +currVal.amount),
    0
  );
  const allTotal = transactions.reduce(
    (acc, currVal) => (acc += +currVal.amount),
    0
  );

  const categories = title === "Income" ? incomeCategories : expenseCategories;

  rightTransactions.forEach((t) => {
    const category = categories.find((c) => c.type === t.source);

    if (category) category.amount += +t.amount;
  });

  const filteredCategories = categories.filter((sc) => sc.amount > 0);

  const chartData = {
    datasets: [
      {
        data: filteredCategories.map((c) => c.amount),
        backgroundColor: filteredCategories.map((c) => c.color),
      },
    ],
    labels: filteredCategories.map((c) => c.type),
  };

  return { filteredCategories, total, chartData, rightTransactions, allTotal };
};

export default useTransactions;
