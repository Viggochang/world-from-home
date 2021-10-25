import React, { useState, useRef } from "react";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";

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

const WelcomePageDiv = styled.div``;

const BackgroundVideo = styled.video`
  position: fixed;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
`;

const BaseDiv = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: rgb(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
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

export default function WelcomePage() {
  const [signInDisplay, setSignInDisplay] = useState(false);
  const signinRef = useRef();

  function handleSignIn(){
    // setSignInDisplay(true);
    signinRef.current.style.display = 'flex';
    console.log('sign in');
  }

  return (
    <WelcomePageDiv>
      {/* <BackgroundVideo autoplay id="myVideo">
        <source src={welcomePage} type="video/mp4"/>
      </BackgroundVideo> */}
      <BaseDiv>
        <TitleDiv> WORLD </TitleDiv>
        <Title2Div> FROM&ensp;HOME </Title2Div>
        <ThemeProvider theme={theme}>
          <Button
            variant="contained"
            color="white"
            style={{
              width: "200px",
              fontSize: "24px",
              borderRadius: "40px",
              lineHeight: 1.5,
              position: "fixed",
              bottom: "72px",
            }}
            onClick = {handleSignIn}
          >
            Sign in
          </Button>
        </ThemeProvider>
        <SigninDiv display={signInDisplay} innerRef={signinRef}/>
      </BaseDiv>
    </WelcomePageDiv>
  );
}
