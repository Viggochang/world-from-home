import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { styled as styledMui } from "@mui/styles";

import { firebase } from "../../../util/firebase";
import { db_userInfo } from "../../../util/firebase";
import socialMediaAuth from "../../../util/auth";
import { facebookProvider, googleProvider } from "../../../util/authMethod";

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
  display: flex; /* to-do */
  flex-direction: column;
  align-items: center;
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

const SignTitleDiv = styled.div`
  font-size: 20px;
  font-weight: bold;
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

const SignInBtn = styledMui(Button)({
  width: "220px",
  fontSize: "12px",
  borderRadius: "40px",
  lineHeight: 1.5,
  marginBottom: "20px",
});

export default function SignInChoice({
  signInRef,
  signInChoiceRef,
  moreInfoFormRef,
}) {
  const dispatch = useDispatch();
  const history = useHistory();

  function handleClose() {
    signInRef.current.style.display = "none";
  }

  function handleToWorldPage() {
    history.push({ pathname: "home" });
  }

  const handleSignin = async (provider) => {
    const res = await socialMediaAuth(provider);
    const {
      email,
      displayName: name,
      photoURL: photo,
    } = firebase.auth().currentUser;
    db_userInfo
      .where("email", "==", email)
      .get()
      .then((snapshot) => {
        let newAccount = true;
        let myUserId = "";
        if (snapshot.empty) {
          myUserId = db_userInfo.doc().id;
          db_userInfo.doc(myUserId).set({ email, name, photo });
          signInChoiceRef.current.style.display = "none";
          moreInfoFormRef.current.style.display = "flex";
        } else {
          snapshot.forEach((doc) => {
            myUserId = doc.id;
          });
          newAccount = false;
        }
        return [myUserId, newAccount];
      })
      .then(([myUserId, newAccount]) => {
        console.log(myUserId);
        dispatch({
          type: "SET_MY_USER_ID",
          payload: myUserId,
        });
        return newAccount;
      })
      .then((newAccount) => {
        if (!newAccount) {
          history.push({ pathname: "home" });
        }
      });
  };

  return (
    <SignInChoiceDiv ref={signInChoiceRef}>
      <CrossDiv onClick={handleClose}>
        <i className="fas fa-times"></i>
      </CrossDiv>
      <SignTitleDiv>SIGN IN</SignTitleDiv>
      <SignInBtnArea>
        <ThemeProvider theme={theme}>
          <SignInBtn
            variant="contained"
            color="primary"
            onClick={() => handleSignin(googleProvider)}
          >
            <i className="fab fa-google"></i> &emsp;&emsp; Sign in with Google
          </SignInBtn>
          <SignInBtn
            variant="contained"
            color="primary"
            onClick={() => handleSignin(facebookProvider)}
          >
            <i className="fab fa-facebook"></i> &emsp;&emsp; Sign in with
            Facebook
          </SignInBtn>
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
            onClick={handleToWorldPage}
          >
            enter
          </Button>
        </ThemeProvider>
      </div>
    </SignInChoiceDiv>
  );
}
