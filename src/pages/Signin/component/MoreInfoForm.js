import React from 'react';
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { styled as styledMui } from "@mui/styles";

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

const SignInChoiceDiv = styled.div`
  width: 400px;
  height: 100%;
  display: none;
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

export default function MoreInfoForm({moreInfoFormRef}) {
  function handleToWorldPage() {
    window.location = "/home";
  }

  return (
    <SignInChoiceDiv ref={moreInfoFormRef}>
      <SignTitleDiv>MORE ABOUT YOU</SignTitleDiv>
      <SignInBtnArea>
        
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
            onClick={handleToWorldPage}
          >
            enter
          </Button>
        </ThemeProvider>
      </div>
    </SignInChoiceDiv>
  )
}
