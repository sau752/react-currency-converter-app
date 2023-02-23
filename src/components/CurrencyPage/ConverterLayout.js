import { Container, Paper } from "@mui/material";
import React, { useState } from "react";
import Converter from "./CurrencyConverter";
import ExchangeHistory from "./ExchangeHistory";

function ConverterLayout() {
  const [fromToCurrency, setFromToCurrency] = useState({
    from: "",
    to: "",
  });

  return (
    <Container maxWidth="md" sx={{ marginTop: 2 }}>
      <Paper sx={{ padding: 2, marginBottom: 2 }}>
        <Converter setFromToCurrency={setFromToCurrency} />
      </Paper>
      {fromToCurrency.from && fromToCurrency.to && (
        <Paper sx={{ padding: 2 }}>
          <ExchangeHistory fromToCurrency={fromToCurrency} />
        </Paper>
      )}
    </Container>
  );
}

export default ConverterLayout;
