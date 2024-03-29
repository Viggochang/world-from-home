import React, { useRef, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setMyUserId, setUserInfo } from "../../redux/action";

import styled from "styled-components";
import { onAuthStateChanged, onSnapShotByUid } from "../../util/firebase";

import SigninDiv from "../signin/Signin";
import landingPageImg from "../../image/landingPage.jpeg";
import { WelcomePageBtn } from "../../util/muiButton";

const defaultUserId = process.env.REACT_APP_DEFAULT_USER_ID;

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
  const dispatch = useDispatch();
  const [signIn, setSignIn] = useState(false);

  useEffect(() => {
    onAuthStateChanged(setSignIn);
  }, []);

  function handleSignIn() {
    signinRef.current.style.zIndex = 2;
  }

  function handleGuest() {
    onSnapShotByUid(defaultUserId, (user_info) => {
      dispatch(setUserInfo(user_info));
    });
    dispatch(setMyUserId(defaultUserId));

    history.push({ pathname: "home" });
  }

  return (
    <>
      <WelcomePageDiv>
        <Mask />
        <TitleDiv> WORLD </TitleDiv>
        <Title2Div> FROM&ensp;HOME </Title2Div>
        <Quote>
          We travel, initially, to lose ourselves; and we travel, next to find
          ourselves
          <br /> – Pico Iyer
        </Quote>

        <ButtonsDiv>
          <WelcomePageBtn content="Sign in" onClick={handleSignIn} />
          {signIn && (
            <WelcomePageBtn
              content={
                <React.Fragment>
                  Enter&ensp;
                  <i className="fas fa-plane" />
                </React.Fragment>
              }
              onClick={handleGuest}
            />
          )}
          <WelcomePageBtn content="Guest" onClick={handleGuest} />
        </ButtonsDiv>
      </WelcomePageDiv>
      <SigninDiv signinRef={signinRef} />
    </>
  );
}
