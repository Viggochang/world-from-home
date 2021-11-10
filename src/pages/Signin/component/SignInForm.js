import React, { useState, useRef } from "react";
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

const SignInFormDiv = styled.div`
  display: flex; /* to-do */
  flex-direction: column;
  align-items: center;
`;

const SignTitleDiv = styled.div`
  font-size: 20px;
  font-weight: bold;
  line-height: 40px;
  border-radius: 20px;
  background-color: white;
  padding: 0 30px;
  margin-top: 80px;
  color: #3a4a58;
  display: flex;
  justify-content: center;
  align-items: center;
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

export default function SignInForm({
  signinRef,
  signInFormRef,
  moreInfoFormRef,
  setCurrentUser,
}) {
  const dispatch = useDispatch();
  const history = useHistory();
  // const [currentUser, setCurrentUser] = useState();

  const handleSignin = async (provider) => {
    const res = await socialMediaAuth(provider);
    if (firebase.auth().currentUser) {
      setCurrentUser(firebase.auth().currentUser);

      db_userInfo
        .where("email", "==", firebase.auth().currentUser.email)
        .get()
        .then((snapshot) => {
          let myUserId = "";
          if (snapshot.empty) {
            myUserId = db_userInfo.doc().id;
            dispatch({
              type: "SET_MY_USER_ID",
              payload: myUserId,
            });
            signInFormRef.current.style.display = "none";
            moreInfoFormRef.current.style.display = "flex";
          } else {
            snapshot.forEach((doc) => {
              myUserId = doc.id;
              dispatch({
                type: "SET_MY_USER_ID",
                payload: myUserId,
              });
              signinRef.current.style.display = "none";
              history.push({ pathname: "home" });
            });
          }
        });
    }
  };

  return (
    <SignInFormDiv ref={signInFormRef}>
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
    </SignInFormDiv>
  );
}
