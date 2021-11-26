import React from "react";
import styled from "styled-components";
import { Switch } from "@mui/material";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";

const theme = createTheme({
  status: {
    danger: "#e53e3e",
  },
  palette: {
    primary: {
      main: "#3A4A58",
      darker: "#053e85",
      font: "#ffffff",
    },
    neutral: {
      main: "#64748B",
      contrastText: "#fff",
    },
    white: {
      main: "#ffffff",
      font: "#3A4A58",
    },
  },
});

const EditingSwitchDiv = styled.div`
  display: flex;
  align-items: center;
  margin: 2px 0 0 auto;
  position: fixed;
  top: 50px;
  right: 420px;
  z-index: 1;
  background-color: #3a4a58;
  border-radius: 20px;
`;

const EditLabel = styled.div`
  font-weight: bold;
  font-size: 20px;
  margin: 0 20px 0 5px;
  line-height: 30px;
  /* border-radius: 15px; */
  /* background-color: rgb(255, 255, 255, 0.7);
  color: #3a4a58; */
  /* background-color: #3a4a58; */
  color: rgb(255, 255, 255, 0.9);
`;

export default function MapSwitch({ setMapType, mapType }) {
  return (
    <ThemeProvider theme={theme}>
      <EditingSwitchDiv>
        <Switch
          checked={mapType}
          onChange={(event) => setMapType(event.target.checked)}
          inputProps={{ "aria-label": "controlled" }}
          color="white"
        />
        <EditLabel>To My World</EditLabel>
      </EditingSwitchDiv>
    </ThemeProvider>
  );
}
