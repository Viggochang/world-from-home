import React, { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

import styled from "styled-components";
import Button from "@material-ui/core/Button";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";

import MyGallery from "./component/MyGallery"
import MyFriends from "./component/MyFriends";

const theme = createTheme({
  status: {
    danger: "#e53e3e",
  },
  palette: {
    primary: {
      main: "#3A4A58",
      darker: "#053e85",
      font: "#ffffff",
    },
    neutral: {
      main: "#64748B",
      contrastText: "#fff",
    },
    white: {
      main: "#ffffff",
      font: "red",
    },
  },
});

const Background = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
`;

const Mask = styled.div`
  width: 100vw;
  height: 100vh;
  background: rgb(142, 142, 142, 0.7);
`;

const MyPageDiv = styled.div`
  /* position: fixed;
  top: 0;
  left: 0; */
  padding: 50px 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(100vw - 160px);
`;

const UpperDiv = styled.div`
  display: flex;
  width: calc(100vw - 160px);
  max-width: 1500px;
`;

const MyPhoto = styled.div`
  width: 450px;
  height: 450px;
  box-shadow: 0px 0px 20px #000000;
`;

const UserInfoDiv = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
  margin-left: 40px;
  max-width: calc(100vw - 704px);
  font-weight: bold;
`;

const ButtonsDiv = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: auto;
  font-size: 48px;
  position: fixed;
  top: 50px;
  right: 80px
`;

const HomeLink = styled(NavLink)`
  color: white;
`;
const SettingLink = styled(NavLink)`
  color: white;
  margin-top: 20px;
`;

const LowerDiv = styled.div`
  display: flex;
  width: calc(100vw - 160px);
  max-width: 1500px;
  margin-top: 40px;
`;

const FriendGalleryBtnsDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function MyPage() {
  const userInfo = useSelector((state) => state.userInfo);
  const { name, country, photo, birthday, background_photo } =
    userInfo;
  const age =
  birthday ? new Date().getFullYear() - new Date(1000 * birthday.seconds).getFullYear() : 0;

  const [activeButton, setActiveButton] = useState('myWorld');


  function handleMyWorld() {
    setActiveButton('myWorld');
  }

  function handleMyFriends() {
    setActiveButton('myFriends');
  }

  return (
    <>
      <Background
        style={{
          backgroundImage: `url(${background_photo})`,
          backgroundSize: "cover",
        }}
      >
        <Mask />
      </Background>
      <MyPageDiv>
        <UpperDiv>
          <MyPhoto
            style={{
              backgroundImage: `url(${photo})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <UserInfoDiv>
            <div style={{ fontSize: 148 }}>{name}</div>
            <div style={{ fontSize: 36 }}>from</div>
            <div style={{ fontSize: 120 }}>{country}</div>
            <div
              style={{ fontSize: 36, marginBottom: "auto" }}
            >{`age: ${age}`}</div>
            <ThemeProvider theme={theme}>
              <Button
                variant="contained"
                color="white"
                style={{
                  width: "220px",
                  fontSize: "16px",
                  borderRadius: "40px",
                  lineHeight: 1.5,
                  fontWeight: "bold",
                  color: "#3A4A58",
                }}
              >
                More about Me
              </Button>
            </ThemeProvider>
          </UserInfoDiv>
          <ButtonsDiv>
            <HomeLink to="home">
              <i className="fas fa-home"></i>
            </HomeLink>
            <SettingLink to="setting">
              <i className="fas fa-cog"></i>
            </SettingLink>
          </ButtonsDiv>
        </UpperDiv>
        <LowerDiv>
          <FriendGalleryBtnsDiv>
            <ThemeProvider theme={theme}>
              <Button
                variant="contained"
                color= {activeButton==='myWorld' ? "primary": "white" }
                style={{
                  width: "180px",
                  fontSize: "20px",
                  borderRadius: "40px",
                  lineHeight: 1.5,
                  fontWeight: "bold",
                }}
                // ref={MyWorldBtnRef}
                onClick={handleMyWorld}
              >
                My World
              </Button>
              <Button
                variant="contained"
                color={activeButton==='myFriends' ? "primary": "white" }
                style={{
                  width: "180px",
                  fontSize: "20px",
                  borderRadius: "40px",
                  lineHeight: 1.5,
                  fontWeight: "bold",
                  marginTop: "20px",
                }}
                // ref={MyFriendsBtnRef}
                onClick={handleMyFriends}
              >
                My Friends
              </Button>
            </ThemeProvider>
          </FriendGalleryBtnsDiv>
          {(activeButton==='myWorld') ? <MyGallery title={'My World'}/>:<MyFriends title={'My Friends'}/>}
        </LowerDiv>
      </MyPageDiv>
    </>
  );
}
