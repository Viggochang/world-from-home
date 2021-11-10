import React from "react";
import Button from "@material-ui/core/Button";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/styles";
import styled from "styled-components";
import { styled as styledMui } from "@mui/styles";
import { orange } from "@mui/material/colors";
import { display } from "@material-ui/system";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3A4A58",
      darker: "#053e85",
    },
    secondary: {
      main: "#B8C3D0",
      darker: "#053e85",
    },
  },
  shape: { borderRadius: 24 },
  typography: {
    button: {
      fontSize: 20,
      fontWeight: 700,
    },
  },
});

// const ButtonStyle = styled(Button)`
//   && {
//     border-radius: "24px";
//     width: "200px";
//     outline: "4px #B8C3D0 solid";
//     font-size: "20px";
//     font-weight: "bold";
//   }
// `;

export default function MuiStyle() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <div style={{ margin: "auto" }}>
        <ThemeProvider theme={theme}>
          <Button
            color="secondary"
            variant="contained"
            sx={{
              outline: "4px #B8C3D0 solid",
              // boxShadow: "0px 0px 5px #000000",
            }}
          >
            Sign in
          </Button>
          {/* <Button className={classes.root}>Sign in</Button> */}
        </ThemeProvider>
      </div>
    </div>
  );
}
