import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import db from "../Utils/firebase";
import "devextreme/dist/css/dx.material.orange.dark.css";
import DataGrid, {
  SearchPanel,
  Paging,
  Column,
} from "devextreme-react/data-grid";
import expense from "../Utils/expense";
import income from "../Utils/income";

import Button from "@mui/material/Button";
import Datagrid from "./Datagrid";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

function Overview() {
  const navigate = useNavigate();
  const [transactionList, setTransactionList] = React.useState([]);

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

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Paper
          variant="outlined"
          sx={{
            my: { xs: 3, md: 3 },
            p: { xs: 1 },
            borderBottom: 5,
            borderBottomColor: "white",
          }}
        >
          <Container
            component="main"
            maxWidth="350px"
            sx={{
              mb: 4,
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              align="center"
              sx={{ margin: 1 }}
            >
              Overview
            </Typography>
            <Datagrid />
            <Button
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => {
                navigate("/");
              }}
            >
              Home
            </Button>
          </Container>
        </Paper>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Paper
          variant="outlined"
          sx={{
            my: { xs: 3, md: 4 },
            p: { xs: 3, md: 4 },
            borderBottom: 5,
            borderBottomColor: "red",
          }}
        >
          <Container
            component="main"
            maxWidth="350px"
            sx={{
              mb: 4,
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              align="center"
              sx={{ margin: 1 }}
            >
              Expense Overview
            </Typography>
            <DataGrid dataSource={expense(transactionList)}>
              <Column dataField="type" alignment="left" visible={true} />
              <Column dataField="amount" alignment="center" visible={true} />
              <SearchPanel visible={true} />
              <Paging defaultPageSize={6} />
            </DataGrid>
          </Container>
        </Paper>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Paper
          variant="outlined"
          sx={{
            my: { xs: 3, md: 4 },
            p: { xs: 3, md: 4 },
            borderBottom: 5,
            borderBottomColor: "green",
          }}
        >
          <Container
            component="main"
            maxWidth="350px"
            sx={{
              mb: 4,
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              align="center"
              sx={{ margin: 1 }}
            >
              Income Overview
            </Typography>
            <DataGrid dataSource={income(transactionList)}>
              <Column dataField="type" alignment="left" visible={true} />
              <Column dataField="amount" alignment="center" visible={true} />
              <SearchPanel visible={true} />
              <Paging defaultPageSize={6} />
            </DataGrid>
          </Container>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default Overview;
