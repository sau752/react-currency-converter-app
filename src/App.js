import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Layout from "./components/Layout";
import { Provider } from "react-redux";
import store from "./store/store";
import { AppBar, Toolbar, Typography, Box, IconButton } from "@mui/material";
import MoneyIcon from '@mui/icons-material/Money';

function App() {
  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#009688", color: '#fff' }}>
        <Toolbar>
        <IconButton color="inherit">
            <MoneyIcon />
          </IconButton>
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            Currency Converter
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ marginTop: 4 }}>
        <Provider store={store}>
          <Router>
            <Layout />
          </Router>
        </Provider>
      </Box>
    </>
  );
}

export default App;
