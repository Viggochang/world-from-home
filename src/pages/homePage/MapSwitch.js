import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Select from "@mui/material/Select";
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
  margin-left: auto;
  position: fixed;
  top: 50px;
  right: 400px;
  z-index: 5;
`;

const EditLabel = styled.div`
  font-weight: bold;
  font-size: 20px;
  padding: 0 10px;
  line-height: 30px;
  border-radius: 15px;
  background-color: rgb(255, 255, 255, 0.7);
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
      </EditingSwitchDiv>
    </ThemeProvider>
  );
}
