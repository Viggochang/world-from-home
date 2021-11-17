import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

import styled from "styled-components";
import Button from "@material-ui/core/Button";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { moreInfoBtnTheme } from "../../util/muiTheme";

import { db_userInfo } from "../../util/firebase";
import FriendState from "../myPage/component/FriendState";

import Background from "../myPage/background/Background";
import MoreInformation from "./moreInformation/MoreInformation";
import UserWorld from "./component/UserWorld";
import countryTrans from "../../util/countryTrans";
import AlbumFriendBtns from "../myPage/component/AlbumFriendBtns";
import MyGallery from "../myPage/component/MyGallery";
import MyFriends from "../myPage/component/MyFriends";
import Login from "../Signin/Signin";
import Logout from "../Signin/Logout";

import Album from "../album/Album";
// import { system } from "@amcharts/amcharts4/core";

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

const MyPageDiv = styled.div`
  /* position: fixed;
  top: 0;
  left: 0; */
  padding: 50px 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(100vw - 160px);
  /* z-index: 1; */
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
  box-shadow: 2px 2px 20px #4f4f4f;
  position: relative;
  color: white;
  border-radius: 20px;
`;

const UserInfoDiv = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
  margin-left: 40px;
  max-width: calc(100vw - 704px);
  font-weight: bold;
  line-height: 1.15;
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
  align-items: center;
  margin-left: auto;
  font-size: 36px;
  position: fixed;
  top: 42px;
  right: 80px;
`;

const HomeLink = styled(NavLink)`
  color: white;
  width: 64px;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  border-radius: 50%;
  :hover {
    background-color: rgb(184, 195, 208, 0.3);
  }
`;
const MyPageIcon = styled.div`
  width: 56px;
  height: 56px;
  margin-top: 20px;
  border-radius: 50%;
  outline: 3px white solid;
  color: white;
  font-size: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: #b8c3d0;
  :hover {
    background-color: #667484;
  }
`;
const MyPageIconMask = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: rgb(225, 225, 225, 0);
  :hover {
    background-color: rgb(225, 225, 225, 0.3);
  }
`;

export default function UserPage() {
  // const moreAboutMeBtnRef = useRef();
  const moreInfoRef = useRef();
  const signinRef = useRef();
  const [userInfo, setUserInfo] = useState({});
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [activeButton, setActiveButton] = useState("Albums");
  const myInfo = useSelector((state) => state.userInfo);
  const myUserId = useSelector((state) => state.myUserId);
  const queryUserId = useSelector((state) => state.queryUserId);
  const history = useHistory();

  // if (id === myInfo.id) {
  //   history.push({ pathname: "mypage" });
  // }

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    console.log(id);
    console.log(myUserId);
    if (queryUserId === myUserId || id === myUserId) {
      history.push({ pathname: "mypage" });
    }

    db_userInfo
      .doc(id)
      .get()
      .then((doc) => {
        setUserInfo(doc.data());
      });
  }, [queryUserId]);

  const { name, country, photo, birthday, background_photo } = userInfo;
  const age =
    birthday &&
    new Date(birthday.seconds * 1000).toDateString() !==
      new Date(0).toDateString()
      ? new Date().getFullYear() -
        new Date(1000 * birthday.seconds).getFullYear()
      : "unknown";

  function handleToMyPage() {
    console.log(myInfo);
    if (Object.keys(myInfo).length) {
      history.push({ pathname: "mypage" });
    } else {
      signinRef.current.style.zIndex = 1;
      console.log("sign in");
    }
  }

  return (
    <>
      <Login signinRef={signinRef} />
      <Background background_photo={background_photo} />
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

            <MoreInformation userInfo={userInfo} />
            {Object.keys(myInfo).length ? (
              <FriendState userInfo={userInfo} />
            ) : (
              <></>
            )}
          </UserInfoDiv>
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
            <MyGallery title={`${name}'s Albums`} id={userInfo.id} />
          ) : (
            <MyFriends title={`${name}'s Friends`} userInfo={userInfo} />
          )}
        </BottomDiv>
        <ButtonsDiv>
          <HomeLink to="home">
            <i className="fas fa-home"></i>
          </HomeLink>
          <Logout />
          <MyPageIcon
            onClick={handleToMyPage}
            style={{
              backgroundImage: `url(${myInfo.photo})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {myInfo.photo ? (
              <MyPageIconMask />
            ) : (
              <i className="fas fa-user-alt"></i>
            )}
          </MyPageIcon>
        </ButtonsDiv>
      </MyPageDiv>
      <Album />
    </>
  );
}
