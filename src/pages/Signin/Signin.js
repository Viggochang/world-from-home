import { style } from '@material-ui/system';
import React, {useRef} from 'react';
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";

import signinImg from '../../image/signin.jpeg';

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

const SigninDiv = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: rgb(0,0,0,0.8);
  position: fixed;
  display: none;
`;

const BaseDiv = styled.div`
  width: 900px;
  height: 600px;
  background-color: #667484;
  margin: auto;
  display: flex;
  position: relative;
`;

const CrossDiv = styled.div`
  position: absolute;
  top: 10px;
  right: 15px;
  color: white;
  font-weight: bold;
  font-size: 20px;
  cursor: pointer;
`;

const PhotoDiv = styled.div`
  width: 500px;
  height: 100%;
  background: url(${signinImg});
  background-size: cover;
  background-position: 60%;
`;

const SignInChoiceDiv = styled.div`
  width: 400px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SignTitleDiv = styled.div`
  font-size: 20px;
  line-height: 40px;
  border-radius: 20px;
  background-color: white;
  padding: 0 30px;
  margin-top: 80px;
`;

const SignInBtnArea = styled.div`
  background-color: white;
  width: 260px;
  height: 230px;
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0;
`;

export default function Login({display, innerRef}) {

  // const signInDisplay = display ? 'flex': 'none';

  // const signinRef = useRef();
  function handleClose() {
    innerRef.current.style.display = 'none';
  } 

  return (
    <SigninDiv ref={innerRef}>
      <BaseDiv>
        <PhotoDiv></PhotoDiv>
        <SignInChoiceDiv>
          <CrossDiv onClick={handleClose}><i class="fas fa-times"></i></CrossDiv>
          <SignTitleDiv>SIGN IN</SignTitleDiv>
          <SignInBtnArea>
            <ThemeProvider theme={theme}>
            <Button
              variant="contained"
              color="primary"
              style={{
                width: "220px",
                fontSize: "12px",
                borderRadius: "40px",
                lineHeight: 1.5,
              }}
            >
              <i className="fab fa-google"></i> &emsp;&emsp; Sign in with Google
            </Button>
            <Button
              variant="contained"
              color="primary"
              style={{
                width: "220px",
                fontSize: "12px",
                borderRadius: "40px",
                lineHeight: 1.5,
                marginTop: "20px",
              }}
            >
              <i class="fab fa-facebook"></i> &emsp;&emsp; Sign in with Facebook
            </Button>
          </ThemeProvider>
          </SignInBtnArea>
          <div>
            <ThemeProvider theme={theme}>
              <Button
                variant="contained"
                color="white"
                style={{
                  marginTop: "30px",
                  borderRadius: "40px",
                  lineHeight: 1.5,
                }}
              >enter
              </Button>
            </ThemeProvider>
          </div>
        </SignInChoiceDiv>
      </BaseDiv>
    </SigninDiv>
  )
}
