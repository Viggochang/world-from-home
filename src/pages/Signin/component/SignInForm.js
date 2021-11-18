import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import { ThemeProvider } from "@material-ui/core/styles";

import { firebase, db_userInfo } from "../../../util/firebase";
import socialMediaAuth from "../../../util/auth";
import { facebookProvider, googleProvider } from "../../../util/authMethod";
import { signInBtnTheme } from "../../../util/muiTheme";
import planeIcon from "../../../image/signinIcon.png";

const SignInFormDiv = styled.div`
  display: flex; /* to-do */
  flex-direction: column;
  align-items: center;
`;

const SignTitleDiv = styled.div`
  font-size: 40px;
  font-weight: bold;
  line-height: 40px;
  padding: 0 30px;
  margin-top: 80px;
  color: #3a4a58;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SignInBtnArea = styled.div`
  background-color: white;
  width: 220px;
  height: 230px;
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 20px;
  box-shadow: 4px 6px 10px rgb(80, 80, 80, 0.5);
  border-radius: 10px;
`;

const PlaneIcon = styled.div`
  background-image: url(${planeIcon});
  background-position: center;
  background-size: cover;
  margin-bottom: 30px;
  width: 200px;
  height: 100px;
  border-radius: 4px;
`;

const SignInBtnStyle = {
  width: "100%",
  marginBottom: "20px",
  boxShadow: "2px 3px 6px rgb(80, 80, 80, 0.7)",
};

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
      <SignTitleDiv>SIGN&ensp;IN</SignTitleDiv>
      <SignInBtnArea>
        <PlaneIcon />
        <ThemeProvider theme={signInBtnTheme}>
          <Button
            variant="contained"
            color="primary"
            sx={SignInBtnStyle}
            onClick={() => handleSignin(googleProvider)}
          >
            <i className="fab fa-google"></i> &emsp;&emsp; Sign in with Google
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={SignInBtnStyle}
            onClick={() => handleSignin(facebookProvider)}
          >
            <i className="fab fa-facebook"></i> &emsp;&emsp; Sign in with
            Facebook
          </Button>
        </ThemeProvider>
      </SignInBtnArea>
    </SignInFormDiv>
  );
}
