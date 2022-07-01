import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import Datagrid from "./Datagrid";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

function Overview() {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Paper
          variant="outlined"
          sx={{
            my: { xs: 3, md: 3 },
            p: { xs: 1 },
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
    </ThemeProvider>
  );
}

export default Overview;
