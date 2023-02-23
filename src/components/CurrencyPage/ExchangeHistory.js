import {
  Box, Container, FormControl,
  InputLabel, MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow, Typography
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";

const ExchangeRateTable = ({ fromToCurrency }) => {
  const [rates, setRates] = useState([]);
  const [selectedDays, setSelectedDays] = useState(7);

  const { currentDate, thirtyDaysAgo } = useMemo(() => {
    let date = new Date();
    const currentDate = date.toISOString().slice(0, 10);
    date.setDate(date.getDate() - 30);
    const thirtyDaysAgo = date.toISOString().slice(0, 10);
    return { currentDate, thirtyDaysAgo };
  }, []);

  const { averageRate, minRate, maxRate } = useMemo(() => {
    const ratesValues = rates.slice(0, selectedDays).map((rate) => rate.rate);
    const averageRate =
      ratesValues.reduce((sum, rate) => sum + rate, 0) / ratesValues.length;
    const minRate = Math.min(...ratesValues);
    const maxRate = Math.max(...ratesValues);
    return { averageRate, minRate, maxRate };
  }, [selectedDays, rates]);

  useEffect(() => {
    if (fromToCurrency.from && fromToCurrency.to) {
      axios
        .get(
          `https://api.exchangerate.host/timeseries?start_date=${thirtyDaysAgo}&end_date=${currentDate}&base=${fromToCurrency.from}&symbols=${fromToCurrency.to}`
        )
        .then(({ data: { rates: ratesData } }) => {
          const ratesArray = Object.keys(ratesData).map((x) => {
            return {
              date: x,
              rate: ratesData[x][fromToCurrency.to],
            };
          });
          setRates(
            ratesArray.sort((a, b) => new Date(b.date) - new Date(a.date))
          );
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [fromToCurrency.from, fromToCurrency.to, currentDate, thirtyDaysAgo]);

  return (
    <Container maxWidth="md">
      <Box>
        <FormControl fullWidth>
          <InputLabel id="my-select-label">Select Number of Days</InputLabel>
          <Select
            value={selectedDays}
            onChange={(event) => setSelectedDays(event.target.value)}
            labelId="my-select-label"
            label="Select Number of Days"
          >
            <MenuItem value={7}>7 Days</MenuItem>
            <MenuItem value={14}>14 Days</MenuItem>
            <MenuItem value={30}>30 Days</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}
      >
        <Box my={3} sx={{ width: "48%" }}>
          <Typography variant="h6" gutterBottom>
            Exchange History ({fromToCurrency.from} to {fromToCurrency.to})
          </Typography>
          <TableContainer component={Paper} sx={{ height: 300 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", color: "#8d8d8d" }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#8d8d8d" }} align="right">
                    Exchange Rate
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rates.slice(0, selectedDays).map((rate) => (
                  <TableRow key={rate.date}>
                    <TableCell>{rate.date}</TableCell>
                    <TableCell align="right">{rate.rate.toFixed(7)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box my={3} sx={{ width: "48%" }}>
          <Typography variant="h6" gutterBottom>
            Exchange Statistics
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", color: "#8d8d8d" }}>Statistics</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#8d8d8d" }} align="right">Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Average rate:</TableCell>
                  <TableCell align="right">{averageRate.toFixed(7)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Minimum rate:</TableCell>
                  <TableCell align="right">{minRate.toFixed(7)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Maximum rate:</TableCell>
                  <TableCell align="right">{maxRate.toFixed(7)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Container>
  );
};

export default ExchangeRateTable;
