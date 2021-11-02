import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

import styled from "styled-components";
import Button from "@material-ui/core/Button";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";

import { db_userInfo } from "../../util/firebase";
import FriendState from "../myPage/component/FriendState";
import MoreInfo from "./component/MoreInfo";
import UserWorld from "./component/UserWorld";
import countryTrans from "../../util/countryTrans";
import AlbumFriendBtns from "../myPage/component/AlbumFriendBtns";
import MyGallery from "../myPage/component/MyGallery";
import MyFriends from "../myPage/component/MyFriends";

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
      font: "#3A4A58",
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
  background: rgb(142, 142, 142, 0.6);
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
  position: relative;
`;

const MyPhoto = styled.div`
  width: 450px;
  height: 450px;
  box-shadow: 0px 0px 20px #000000;
  position: relative;
  color: white;
`;

const UserInfoDiv = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
  margin-left: 40px;
  max-width: calc(100vw - 704px);
  font-weight: bold;
  line-height: 1.15;
  position: relative;
`;
const CountryDiv = styled.div`
  display: flex;
`;
const MyCountryDiv = styled.div`
  font-size: 120px;
  display: flex;
  align-items: baseline;
`;

const MiddleDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100vw - 160px);
  max-width: 1500px;
  height: calc((100vw - 160px) * (4 / 7));
  max-height: 900px;
  margin-top: 40px;
  position: relative;
`;

const Title = styled.div`
  color: white;
  font-size: 54px;
  font-weight: bold;
  margin-right: auto;
  position: absolute;
  bottom: 40px;
  left: 40px;
  z-index: 1;
`;

const BottomDiv = styled.div`
  display: flex;
  width: calc(100vw - 160px);
  max-width: 1500px;
  margin-top: 40px;
`;

const ButtonsDiv = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: auto;
  font-size: 48px;
  position: fixed;
  top: 50px;
  right: 80px;
`;

const HomeLink = styled(NavLink)`
  color: white;
  :hover {
    color: #3a4a58;
  }
`;
const SettingLink = styled(NavLink)`
  color: white;
  margin-top: 20px;
`;

export default function UserPage() {
  const id = new URLSearchParams(window.location.search).get("id");

  // const moreAboutMeBtnRef = useRef();
  const moreInfoRef = useRef();
  const [userInfo, setUserInfo] = useState({});
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [activeButton, setActiveButton] = useState("Albums");

  useEffect(() => {
    db_userInfo
      .doc(id)
      .get()
      .then((doc) => {
        setUserInfo(doc.data());
      });
  }, []);

  const { name, country, photo, birthday, background_photo } = userInfo;
  const age =
    new Date(birthday.seconds * 1000).toDateString() !==
    new Date(0).toDateString()
      ? new Date().getFullYear() -
        new Date(1000 * birthday.seconds).getFullYear()
      : "unknown";

  function handleShow(ref) {
    ref.current.style.display = "flex";
  }
  function handleDisappear(ref) {
    ref.current.style.display = "none";
  }

  function handleMoreInfo() {
    setShowMoreInfo(showMoreInfo ? false : true);
    if (!showMoreInfo) {
      handleShow(moreInfoRef);
    } else {
      handleDisappear(moreInfoRef);
    }
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
            <CountryDiv>
              <MyCountryDiv>
                {country ? countryTrans[country].name_en : ""}
              </MyCountryDiv>
            </CountryDiv>
            <div
              style={{ fontSize: 36, marginBottom: "24px" }}
            >{`age: ${age}`}</div>

            <ThemeProvider theme={theme}>
              <Button
                onClick={() => {
                  handleMoreInfo();
                }}
                variant="contained"
                color={showMoreInfo ? "primary" : "white"}
                // color={activeButton === "Friends" ? "primary" : "white"}
                style={{
                  width: "220px",
                  fontSize: "16px",
                  borderRadius: "40px",
                  lineHeight: 1.5,
                  fontWeight: "bold",
                  color: showMoreInfo ? "white" : "#3A4A58",
                }}
              >
                More about Me
              </Button>
            </ThemeProvider>
            <FriendState userInfo={userInfo} />
          </UserInfoDiv>
          <MoreInfo
            innerRef={moreInfoRef}
            userInfo={userInfo}
            handleMoreInfo={handleMoreInfo}
          />
        </UpperDiv>
        <MiddleDiv>
          <Title>{`World from ${name}`}</Title>
          <UserWorld userInfo={userInfo} />
        </MiddleDiv>
        <BottomDiv>
          <AlbumFriendBtns
            activeButton={activeButton}
            setActiveButton={setActiveButton}
          />
          {activeButton === "Albums" ? (
            <MyGallery title={`${name}'s Albums`} id={id} />
          ) : (
            <MyFriends title={`${name}'s Friends`} userInfo={userInfo} />
          )}
        </BottomDiv>
        <ButtonsDiv>
          <HomeLink to="home">
            <i className="fas fa-home"></i>
          </HomeLink>
          <SettingLink to="setting">
            <i className="fas fa-cog"></i>
          </SettingLink>
        </ButtonsDiv>
      </MyPageDiv>
    </>
  );
}
