import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import HistoryIcon from "@mui/icons-material/History";
import { styled } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import * as React from "react";
import { Link, useRoutes, useLocation } from "react-router-dom";
import ConversionHistory from "./HistoryPage/ConversionHistory";
import ConverterLayout from "./CurrencyPage/ConverterLayout";

const NavLink = styled(Link)({
  color: "#333",
  textDecoration: "none",
});

function Layout() {
  const route = useRoutes([
    { path: "/", element: <ConverterLayout /> },
    { path: "/history", element: <ConversionHistory /> },
  ]);

  const location = useLocation();

  const [value, setValue] = React.useState(() => {
    if (location.pathname === "/history") {
      return 1;
    } else {
      return 0;
    }
  });

  React.useEffect(() => {
    if (location.pathname === "/history") {
      setValue(1);
    } else {
      setValue(0);
    }
  }, [location]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs value={value} onChange={handleChange} centered>
        <Tab
          icon={<CurrencyExchangeIcon />}
          label="Converter"
          component={NavLink}
          to="/"
        />
        <Tab
          icon={<HistoryIcon />}
          label="History"
          component={NavLink}
          to="/history"
        />
      </Tabs>
      {route}
    </>
  );
}


export default Layout;
