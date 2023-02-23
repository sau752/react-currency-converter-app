import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import {
  Alert,
  Autocomplete,
  Button,
  Card,
  Grid,
  IconButton,
  Snackbar,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

const getCurrentTimeStamp = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth()).padStart(2, "0");
  const year = today.getFullYear();
  const hour = String(today.getHours()).padStart(2, "0");
  const min = String(today.getMinutes()).padStart(2, "0");
  const currentDate = `${day}/${month}/${year} @ ${hour}:${min}`;

  return currentDate;
};

function CurrencyConverter({ setFromToCurrency }) {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("EUR");
  const [toCurrency, setToCurrency] = useState("USD");
  const [convertedAmount, setConvertedAmount] = useState("");
  const [currencyCodes, setCurrencyCodes] = useState([]);
  const [conversionRates, setConversionRates] = useState(null);
  const [fromToPair, setfromToPair] = useState({ from: "", to: "" });
  const [openError, setOpenError] = useState(false);
  const [isFromView, setIsFromView] = useState(false);

  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        const response = await axios.get(
          "https://api.exchangerate.host/symbols"
        );
        setCurrencyCodes(Object.keys(response.data.symbols));
      } catch (error) {
        console.error(error);
      }
    };
    fetchSymbols();
  }, []);

  useEffect(() => {
    const fetchConversions = async () => {
      try {
        const response = await axios.get(
          `https://api.exchangerate.host/latest?base=${fromCurrency}`
        );
        setConversionRates(response.data.rates);
      } catch (error) {
        console.error(error);
      }
    };
    fetchConversions();
  }, [fromCurrency]);

  useEffect(() => {
    if (location.state) {
      setFromCurrency(location.state.from);
      setToCurrency(location.state.to);
      setAmount(location.state.amount);
      setIsFromView(true);
    }
  }, [location.state]);

  const handleCurrencySwap = useCallback(() => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }, [fromCurrency, toCurrency]);

  const handleConversion = useCallback(() => {
    if (amount === "" || isNaN(amount)) {
      setOpenError(true);
      return;
    }

    if (!fromCurrency || !currencyCodes.includes(fromCurrency)) {
      setOpenError(true);
      return;
    }

    if (!toCurrency || !currencyCodes.includes(toCurrency)) {
      setOpenError(true);
      return;
    }

    const rate = conversionRates[toCurrency];
    setConvertedAmount(
      `${amount} ${fromCurrency} = ${(Number(amount) * rate).toFixed(
        3
      )} ${toCurrency}`
    );

    if (fromToPair.from !== fromCurrency || fromToPair.to !== toCurrency) {
      setFromToCurrency({
        from: fromCurrency,
        to: toCurrency,
      });
    }

    setfromToPair({
      from: fromCurrency,
      to: toCurrency,
    });

    dispatch({
      type: "ADD",
      data: {
        from: fromCurrency,
        to: toCurrency,
        date: getCurrentTimeStamp(),
        amount: amount,
      },
    });

    setIsFromView(false);
  }, [
    amount,
    fromCurrency,
    toCurrency,
    currencyCodes,
    conversionRates,
    fromToPair,
    setFromToCurrency,
    dispatch,
  ]);

  useEffect(() => {
    if (conversionRates && isFromView) handleConversion();
  }, [conversionRates, isFromView, handleConversion]);

  const handleCloseError = useCallback((event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenError(false);
  }, []);

  return (
    <Grid container spacing={2} style={{ padding: 16 }}>
      <Grid item xs={12} sm={3}>
        <TextField
          type="number"
          label="Amount"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          fullWidth
          inputProps={{ "data-testid": "amount-field" }}
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={currencyCodes}
          value={fromCurrency}
          onChange={(event, newValue) => setFromCurrency(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="From" fullWidth />
          )}
        />
      </Grid>
      <Grid
        item
        xs={12}
        sm={1}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <IconButton onClick={handleCurrencySwap}>
          <SwapHorizIcon />
        </IconButton>
      </Grid>
      <Grid item xs={12} sm={3}>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={currencyCodes}
          value={toCurrency}
          onChange={(event, newValue) => setToCurrency(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="To" fullWidth />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={2}>
        <Button
          variant="contained"
          onClick={handleConversion}
          fullWidth
          style={{ height: "100%" }}
        >
          Convert
        </Button>
      </Grid>
      {convertedAmount && (
        <Grid item xs={12}>
          <Card
            sx={{
              bgcolor: "#000",
              color: "#fff",
              p: 2,
              borderRadius: "5px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 2,
              marginRight: 4,
              marginLeft: 4,
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h4"
              sx={{ color: "#94c720" }}
              data-testid="conversion-text"
            >
              {convertedAmount}
            </Typography>
            {fromCurrency && toCurrency && (
              <Box>
                <Typography variant="body1">
                  1 {fromCurrency} = {conversionRates[toCurrency].toFixed(7)}{" "}
                  {toCurrency}
                </Typography>
                <Typography variant="body1">
                  1 {toCurrency} ={" "}
                  {(1 / conversionRates[toCurrency]).toFixed(7)} {fromCurrency}
                </Typography>
              </Box>
            )}
          </Card>
        </Grid>
      )}
      <Snackbar
        open={openError}
        autoHideDuration={5000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseError} severity="error">
          Please enter a valid amount and currencies.
        </Alert>
      </Snackbar>
    </Grid>
  );
}

export default CurrencyConverter;
