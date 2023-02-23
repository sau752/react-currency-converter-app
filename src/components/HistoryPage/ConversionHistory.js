import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const TableHeader = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell sx={{ fontWeight: "bold", width: "25%", color: "#8d8d8d" }}>
          Date
        </TableCell>
        <TableCell sx={{ fontWeight: "bold", width: "50%", color: "#8d8d8d" }}>
          Event
        </TableCell>
        <TableCell sx={{ fontWeight: "bold", width: "25%", color: "#8d8d8d" }}>
          Action
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

const TableRowComponent = ({
  row,
  index,
  selectedRow,
  handleMouseEnter,
  handleMouseLeave,
  handleView,
  handleDelete,
}) => {
  const shouldRender = useMemo(
    () => selectedRow === index,
    [selectedRow, index]
  );

  const styles = {
    iconButton: {
      fontSize: "small",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    viewIcon: {
      color: "#508CC9",
    },
    deleteIcon: {
      color: "#C70D38",
    },
    actionText: {
      fontSize: "small",
    },
    actionButton: {
      display: "flex",
      alignItems: "center",
    },
    row: {
      cursor: "pointer",
    },
  };

  return (
    <TableRow
      key={index}
      onMouseEnter={() => handleMouseEnter(index)}
      onMouseLeave={handleMouseLeave}
      style={styles.row}
    >
      <TableCell>{row.date}</TableCell>
      <TableCell>
        {`Converted an amount of ${row.amount} from ${row.from} to ${row.to}`}
      </TableCell>
      <TableCell align="right">
        {shouldRender && (
          <Box sx={styles.actionButton}>
            <Box sx={styles.actionButton}>
              <IconButton
                sx={{ ...styles.iconButton, ...styles.viewIcon }}
                onClick={() => handleView(index)}
              >
                <VisibilityIcon />
              </IconButton>
              <Typography
                sx={{ ...styles.actionText, ...styles.viewIcon }}
                variant="body1"
              >
                View
              </Typography>
            </Box>
            <Box sx={styles.actionButton}>
              <IconButton
                sx={{ ...styles.iconButton, ...styles.deleteIcon }}
                onClick={() => handleDelete(index)}
              >
                <DeleteIcon />
              </IconButton>
              <Typography
                sx={{ ...styles.actionText, ...styles.deleteIcon }}
                variant="body1"
              >
                Delete
              </Typography>
            </Box>
          </Box>
        )}
      </TableCell>
    </TableRow>
  );
};

const ConversionHistory = () => {
  const history = useSelector((state) => state.history);

  const [selectedRow, setSelectedRow] = useState(null);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleView = (index) => {
    navigate("/", { state: history[index] });
  };

  const handleDelete = (index) => {
    dispatch({
      type: "DELETE",
      index: index,
    });
  };

  const handleMouseEnter = (index) => {
    setSelectedRow(index);
  };

  const handleMouseLeave = () => {
    setSelectedRow(null);
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: 2 }}>
      <TableContainer component={Paper} sx={{ height: 700 }}>
        <Table stickyHeader size="small" aria-label="event table">
          <TableHeader />
          <TableBody>
            {history.map((row, index) => (
              <TableRowComponent
                row={row}
                index={index}
                selectedRow={selectedRow}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
                handleView={handleView}
                handleDelete={handleDelete}
                key={index}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ConversionHistory;
