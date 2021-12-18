import React from "react";
import styled from "styled-components";
import { Switch } from "@mui/material";
import { ThemeProvider } from "@material-ui/core/styles";
import { whiteBtnTheme } from "../../util/muiTheme";

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
  @media (max-width: 700px) {
    right: 140px;
    top: 105px;
  }
`;

const EditLabel = styled.div`
  font-weight: bold;
  font-size: 20px;
  margin: 0 20px 0 5px;
  line-height: 30px;
  color: rgb(255, 255, 255, 0.9);
`;

export default function MapSwitch({ setMapType, mapType }) {
  return (
    <ThemeProvider theme={whiteBtnTheme}>
      <EditingSwitchDiv>
        <Switch
          checked={mapType}
          onChange={(event) => setMapType(event.target.checked)}
          inputProps={{ "aria-label": "controlled" }}
          color="white"
        />
        <EditLabel>Edit My World</EditLabel>
      </EditingSwitchDiv>
    </ThemeProvider>
  );
}
