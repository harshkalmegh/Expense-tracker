import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import Button from "@mui/material/Button";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import useTransactions from "../Utils/useTransactions";
import { incomeCategories, expenseCategories } from "../Utils/categories";

import "../Style/Home.css";
import db from "../Utils/firebase";

const theme = createTheme({
  palette: {
    mode: "light",
  },
});

ChartJS.register(ArcElement, Tooltip, Legend);

function Home() {
  const [expenseDetails, setExpenseDetails] = React.useState({
    type: "",
    source: "",
    amount: "",
    date: new Date().toDateString(),
  });
  const [transactionList, setTransactionList] = React.useState([]);
  const [incomeList, setIncomeList] = React.useState([]);
  const [expenseList, setExpenseList] = React.useState([]);

  React.useEffect(() => {
    const transactionRef = db.database().ref("Transaction");
    transactionRef.on("value", (snapshot) => {
      const transactions = snapshot.val();
      const list = [];
      for (let id in transactions) {
        list.push({ id, ...transactions[id] });
      }
      setTransactionList(list);
      let a = list.filter(function (currentElement) {
        // the current value is an object, so you can check on its properties
        return currentElement.type === "Income";
      });
      let b = list.filter(function (currentElement) {
        // the current value is an object, so you can check on its properties
        return currentElement.type === "Expense";
      });
      setIncomeList(a);
      setExpenseList(b);
    });
  }, []);

  const createExpense = () => {
    if (expenseDetails.amount !== "") {
      const transactionRef = db.database().ref("Transaction");
      transactionRef.push(expenseDetails);
    }
    setExpenseDetails({
      type: "",
      source: "",
      amount: "",
      date: new Date().toDateString(),
    });
  };

  const inputUpdate = (e) => {
    const { name, value } = e.target;
    setExpenseDetails({ ...expenseDetails, [name]: value });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <Paper
          variant="outlined"
          sx={{
            my: { xs: 3, md: 4 },
            p: { xs: 2, md: 3 },
            borderBottom: 5,
            borderBottomColor: "red",
          }}
        >
          <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
            <Typography
              component="h1"
              variant="h4"
              align="center"
              sx={{ margin: 1 }}
            >
              ₹{useTransactions("Expense", transactionList).total}
            </Typography>
            <div style={{ width: "350px" }}>
              <Doughnut
                data={useTransactions("Expense", transactionList).chartData}
              />
            </div>
            {useTransactions("Expense", transactionList).rightTransactions.map(
              (item, key) => {
                return (
                  <div key={key}>
                    <span>
                      {key + 1}
                      {") "}
                      {item.source}
                      {" - ₹"}
                      {item.amount}{" "}
                    </span>
                    <button
                      onClick={() => {
                        const transactionRef = db
                          .database()
                          .ref("Transaction")
                          .child(item.id);
                        transactionRef.remove();
                      }}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        setExpenseDetails({
                          type: item.type,
                          source: item.source,
                          amount: item.amount,
                          date: new Date(item.date),
                        });
                        const transactionRef = db
                          .database()
                          .ref("Transaction")
                          .child(item.id);
                        transactionRef.remove();
                      }}
                    >
                      Edit
                    </button>
                  </div>
                );
              }
            )}
          </Container>
        </Paper>
        <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
          <Paper
            variant="outlined"
            sx={{ my: { xs: 3, md: 4 }, p: { xs: 2, md: 3 } }}
          >
            <Box display="flex" justifyContent="center" alignItems="center">
              <Typography
                component="h1"
                variant="h4"
                align="center"
                sx={{ margin: 1 }}
              >
                Expense Tracker
              </Typography>
            </Box>
            <Box component="form" noValidate sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Expense Type
                    </InputLabel>
                    <Select
                      id="type"
                      value={expenseDetails.type}
                      name="type"
                      label="Expense Type"
                      onChange={inputUpdate}
                    >
                      <MenuItem value={"Income"}>Income</MenuItem>
                      <MenuItem value={"Expense"}>Expense</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Expense Source
                    </InputLabel>
                    <Select
                      id="source"
                      value={expenseDetails.source}
                      name="source"
                      label="Expense Source"
                      onChange={inputUpdate}
                    >
                      {expenseDetails.type === "Income"
                        ? incomeCategories.map((item, key) => {
                            return (
                              <MenuItem value={item.type} key={key}>
                                {item.type}
                              </MenuItem>
                            );
                          })
                        : expenseCategories.map((item, key) => {
                            return (
                              <MenuItem value={item.type} key={key}>
                                {item.type}
                              </MenuItem>
                            );
                          })}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="amount"
                    fullWidth
                    id="amount"
                    label="Amount"
                    value={expenseDetails.amount}
                    onChange={inputUpdate}
                  />
                </Grid>
                <Grid item xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Stack spacing={3}>
                      <DesktopDatePicker
                        label="Date"
                        inputFormat="dd/MM/yyyy"
                        value={expenseDetails.date}
                        onChange={(newDate) => {
                          setExpenseDetails({
                            ...expenseDetails,
                            date: new Date(newDate).toDateString(),
                          });
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </Stack>
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 3, mb: 2 }}
                    onClick={createExpense}
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Container>
        <Paper
          variant="outlined"
          sx={{
            my: { xs: 3, md: 4 },
            p: { xs: 2, md: 3 },
            borderBottom: 5,
            borderBottomColor: "green",
          }}
        >
          <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
            <Typography
              component="h1"
              variant="h4"
              align="center"
              sx={{ margin: 1 }}
            >
              ₹{useTransactions("Income", transactionList).total}
            </Typography>
            <div style={{ width: "350px" }}>
              <Doughnut
                data={useTransactions("Income", transactionList).chartData}
              />
            </div>
            {useTransactions("Income", transactionList).rightTransactions.map(
              (item, key) => {
                return (
                  <div key={key}>
                    <span>
                      {key + 1}
                      {") "}
                      {item.source}
                      {" - ₹"}
                      {item.amount}{" "}
                    </span>
                    <button
                      onClick={() => {
                        const transactionRef = db
                          .database()
                          .ref("Transaction")
                          .child(item.id);
                        transactionRef.remove();
                      }}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        setExpenseDetails({
                          type: item.type,
                          source: item.source,
                          amount: item.amount,
                          date: new Date(item.date),
                        });
                        const transactionRef = db
                          .database()
                          .ref("Transaction")
                          .child(item.id);
                        transactionRef.remove();
                      }}
                    >
                      Edit
                    </button>
                  </div>
                );
              }
            )}
          </Container>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default Home;
