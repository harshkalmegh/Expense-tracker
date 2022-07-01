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
import { useNavigate } from "react-router-dom";
import "../Style/Home.css";
import db from "../Utils/firebase";

const theme = createTheme({
  palette: {
    mode: "dark",
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

  const navigate = useNavigate();

  React.useEffect(() => {
    const transactionRef = db.database().ref("Transaction");
    transactionRef.on("value", (snapshot) => {
      const transactions = snapshot.val();
      const list = [];
      for (let id in transactions) {
        list.push({ id, ...transactions[id] });
      }
      setTransactionList(list);
    });
  }, []);

  const createExpense = () => {
    if (expenseDetails.amount !== "") {
      const transactionRef = db.database().ref("Transaction");
      transactionRef.push(expenseDetails);
      setExpenseDetails({
        type: "",
        source: "",
        amount: "",
        date: new Date().toDateString(),
      });
    }
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
          className="expenseDoughnut"
        >
          <Container
            component="main"
            maxWidth="350px"
            sx={{
              mb: 4,
              maxHeight: "350px",
            }}
          >
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
          </Container>
        </Paper>
        <Container
          component="main"
          maxWidth="sm"
          sx={{
            mb: 4,
            height: "590px",
          }}
        >
          <Paper
            variant="outlined"
            sx={{
              my: { xs: 3, md: 4 },
              p: { xs: 2, md: 3 },
              borderBottom: 5,
              borderBottomColor: "white",
            }}
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
            <Box display="flex" justifyContent="center" alignItems="center">
              <Typography
                component="h1"
                variant="h4"
                align="center"
                sx={{ margin: 1 }}
              >
                Total - ₹
                {useTransactions("Income", transactionList).total -
                  useTransactions("Expense", transactionList).total}
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
          className="IncomeDoughnut"
        >
          <Container
            component="main"
            maxWidth="sm"
            sx={{ mb: 4, maxHeight: "350px" }}
          >
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
          </Container>
        </Paper>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Paper
          variant="outlined"
          sx={{
            my: { xs: 3, md: 4 },
            p: { xs: 2, md: 3 },
            borderBottom: 5,
            borderBottomColor: "red",
          }}
          className="ExpenseDetails"
        >
          <Container
            component="main"
            maxWidth="sm"
            sx={{
              mb: 4,
              maxHeight: "350px",
              width: "400px",
              overflow: "hidden",
            }}
          >
            {useTransactions("Expense", transactionList)
              .rightTransactions.slice(0)
              .reverse()
              .map((item, key) => {
                return (
                  <div key={key}>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography sx={{ margin: 1 }}>
                        {`${key + 1}) ${item.source} - ₹${item.amount} `}
                      </Typography>
                      <Button
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={() => {
                          const transactionRef = db
                            .database()
                            .ref("Transaction")
                            .child(item.id);
                          transactionRef.remove();
                        }}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
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
                      </Button>
                    </Grid>
                  </div>
                );
              })}
          </Container>
        </Paper>
        <Paper
          variant="outlined"
          sx={{
            my: { xs: 3, md: 4 },
            p: { xs: 2, md: 3 },
            borderBottom: 5,
            borderBottomColor: "white",
          }}
          className="transactionDetailsMainContainer"
        >
          <Container
            component="main"
            maxWidth="sm"
            sx={{
              mb: 4,
              maxHeight: "350px",
              overflow: "hidden",
            }}
          >
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
              onClick={() => {
                navigate("/overview");
              }}
            >
              Overview
            </Button>
            {transactionList
              .slice(0)
              .reverse()
              .map((item, key) => {
                return (
                  <Grid
                    item
                    key={key}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                    className="transactionDetails"
                  >
                    <Typography sx={{ margin: 1 }}>
                      {`${key + 1}) ${item.source} - ₹${item.amount} `}
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                      onClick={() => {
                        const transactionRef = db
                          .database()
                          .ref("Transaction")
                          .child(item.id);
                        transactionRef.remove();
                      }}
                    >
                      Delete
                    </Button>
                  </Grid>
                );
              })}
          </Container>
        </Paper>
        <Paper
          variant="outlined"
          sx={{
            my: { xs: 3, md: 4 },
            p: { xs: 2, md: 3 },
            borderBottom: 5,
            borderBottomColor: "green",
          }}
          className="IncomeDetails"
        >
          <Container
            component="main"
            maxWidth="sm"
            sx={{
              mb: 4,
              maxHeight: "350px",
              width: "400px",
              overflow: "hidden",
            }}
          >
            {useTransactions("Income", transactionList)
              .rightTransactions.slice(0)
              .reverse()
              .map((item, key) => {
                return (
                  <div key={key}>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography sx={{ margin: 1 }}>
                        {`${key + 1}) ${item.source} - ₹${item.amount} `}
                      </Typography>
                      <Button
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={() => {
                          const transactionRef = db
                            .database()
                            .ref("Transaction")
                            .child(item.id);
                          transactionRef.remove();
                        }}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
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
                      </Button>
                    </Grid>
                  </div>
                );
              })}
          </Container>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default Home;
