import React, { useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { styled as styledMui } from "@mui/styles";

import welcomePage from "../../image/welcomePage.mp4";
import SigninDiv from "../Signin/Signin";

const theme = createTheme({
  status: {
    danger: "#e53e3e",
  },
  palette: {
    primary: {
      main: "#3A4A58",
      darker: "#053e85",
    },
    neutral: {
      main: "#64748B",
      contrastText: "#fff",
    },
    white: {
      main: "#ffffff",
    },
  },
});

const WelcomePageDiv = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: rgb(128, 128, 128);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
`;

const BackgroundVideo = styled.video`
  position: fixed;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
`;

const TitleDiv = styled.div`
  font-size: 132px;
  color: white;
  font-weight: bold;
  margin-top: 30vh;
`;

const Title2Div = styled.div`
  font-size: 72px;
  color: white;
  font-weight: bold;
`;

const ButtonsDiv = styled.div`
  display: flex;
  margin: auto 0 72px;
`;

export default function WelcomePage() {
  const history = useHistory();
  const signinRef = useRef();

  function handleSignIn() {
    signinRef.current.style.zIndex = 2;
    console.log("sign in");
  }

  function handleGuest() {
    history.push({ pathname: "home" });
  }

  return (
    <WelcomePageDiv>
      {/* <BackgroundVideo autoplay id="myVideo">
        <source src={welcomePage} type="video/mp4"/>
      </BackgroundVideo> */}
      <TitleDiv> WORLD </TitleDiv>
      <Title2Div> FROM&ensp;HOME </Title2Div>
      <ThemeProvider theme={theme}>
        <ButtonsDiv>
          <Button
            variant="contained"
            color="white"
            style={{
              width: "200px",
              fontSize: "24px",
              fontWeight: "bold",
              borderRadius: "40px",
              lineHeight: 1.5,
              margin: "0 20px",
              color: "#3A4A58",
              outline: "3px #3A4A58 solid",
            }}
            onClick={handleSignIn}
          >
            Sign in
          </Button>
          <Button
            variant="contained"
            color="white"
            style={{
              width: "200px",
              fontSize: "24px",
              fontWeight: "bold",
              borderRadius: "40px",
              lineHeight: 1.5,
              margin: "0 20px",
              color: "#3A4A58",
              outline: "3px #3A4A58 solid",
            }}
            onClick={handleGuest}
          >
            Guest
          </Button>
        </ButtonsDiv>
      </ThemeProvider>
      <SigninDiv signinRef={signinRef} />
    </WelcomePageDiv>
  );
}
