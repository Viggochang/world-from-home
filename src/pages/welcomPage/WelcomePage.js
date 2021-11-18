import React, { useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { firebase } from "../../util/firebase";

import welcomePage from "../../image/welcomePage.mp4";
import SigninDiv from "../Signin/Signin";
import landingPageImg from "../../image/landingPage.jpeg";

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
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
  background-color: rgb(128, 128, 128);
  background-image: url(${landingPageImg});
  background-position: center;
  background-size: cover;
`;

const Mask = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: rgb(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
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
  z-index: 1;
  @media (max-width: 640px) {
    font-size: 92px;
  }
  @media (max-width: 450px) {
    font-size: 72px;
  }
`;

const Title2Div = styled.div`
  font-size: 72px;
  color: white;
  font-weight: bold;
  z-index: 1;
  @media (max-width: 640px) {
    font-size: 60px;
  }
  @media (max-width: 450px) {
    font-size: 48px;
  }
`;

const Quote = styled.div`
  color: white;
  z-index: 1;
  font-size: 22px;
  position: fixed;
  bottom: 50px;
  text-align: right;
  @media (max-width: 800px) {
    font-size: 16px;
  }
  @media (max-width: 600px) {
    width: calc(100% - 80px);
    font-size: 16px;
  }
`;

const ButtonsDiv = styled.div`
  display: flex;
  margin: auto 0 140px;
  @media (max-width: 500px) {
    height: 130px;
    flex-direction: column;
    justify-content: space-between;
  }
`;

export default function WelcomePage() {
  const history = useHistory();
  const signinRef = useRef();

  // useEffect(() => {
  //   firebase.auth().onAuthStateChanged((user) => {
  //     if (user) {
  //       history.push({ pathname: "/home" });
  //     }
  //   });
  // }, []);

  function handleSignIn() {
    signinRef.current.style.zIndex = 2;
    console.log("sign in");
  }

  function handleGuest() {
    history.push({ pathname: "home" });
  }

  return (
    <>
      <WelcomePageDiv>
        {/* <BackgroundVideo autoplay id="myVideo">
        <source src={welcomePage} type="video/mp4"/>
      </BackgroundVideo> */}
        <Mask />
        <TitleDiv> WORLD </TitleDiv>
        <Title2Div> FROM&ensp;HOME </Title2Div>
        <Quote>
          We travel, initially, to lose ourselves; and we travel, next to find
          ourselves
          <br /> – Pico Iyer
        </Quote>

        <ThemeProvider theme={theme}>
          <ButtonsDiv>
            {/* <MyButton
            text="Sign In"
            style={{ margin: "0 20px" }}
            onClick={handleSignIn}
          />
          <MyButton
            text="Guest"
            style={{ margin: "0 20px" }}
            onClick={handleGuest}
          /> */}
            <Button
              variant="contained"
              color="white"
              sx={{
                width: "200px",
                fontSize: "24px",
                fontWeight: "bold",
                borderRadius: "40px",
                lineHeight: 1.5,
                margin: "0 20px",
                color: "#3A4A58",
                // outline: "3px #3A4A58 solid",
                boxShadow: "3px 3px 10px 5px rgb(80, 80, 80, 0.7)",
                ":hover": {
                  backgroundColor: "#e0e0e0",
                },
              }}
              onClick={handleSignIn}
            >
              Sign in
            </Button>
            <Button
              variant="contained"
              color="white"
              sx={{
                width: "200px",
                fontSize: "24px",
                fontWeight: "bold",
                borderRadius: "40px",
                lineHeight: 1.5,
                margin: "0 20px",
                color: "#3A4A58",
                // outline: "3px #3A4A58 solid",
                boxShadow: "3px 3px 10px 5px rgb(80, 80, 80, 0.7)",
                // boxShadow: "3px 3px 10px rgb(80, 80, 80, 0.7)",
                ":hover": {
                  backgroundColor: "#e0e0e0",
                },
              }}
              onClick={handleGuest}
            >
              Guest
            </Button>
          </ButtonsDiv>
        </ThemeProvider>
      </WelcomePageDiv>
      <SigninDiv signinRef={signinRef} />
    </>
  );
}
