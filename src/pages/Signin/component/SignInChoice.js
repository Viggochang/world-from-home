import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";

import SignInForm from "./SignInForm";
import MoreInfoForm from "./MoreInfoForm";

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

export default function SignInChoice({ signinRef }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const signInFormRef = useRef();
  const moreInfoFormRef = useRef();

  const [currentUser, setCurrentUser] = useState({});

  function handleClose() {
    signinRef.current.style.zIndex = -1;
  }

  return (
    <SignInChoiceDiv>
      <SignInForm
        signinRef={signinRef}
        signInFormRef={signInFormRef}
        moreInfoFormRef={moreInfoFormRef}
        setCurrentUser={setCurrentUser}
      />
      <MoreInfoForm
        signinRef={signinRef}
        signInFormRef={signInFormRef}
        moreInfoFormRef={moreInfoFormRef}
        currentUser={currentUser}
      />
      <CrossDiv onClick={handleClose}>
        <i className="fas fa-times"></i>
      </CrossDiv>
      {/* <div>
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
      </div> */}
    </SignInChoiceDiv>
  );
}
