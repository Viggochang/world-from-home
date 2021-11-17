import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router";
import { useSelector, useDispatch } from "react-redux";

import styled from "styled-components";

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
  width: 350px;
  height: 350px;
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
  font-size: 88px;
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

const HomeDiv = styled.div`
  color: white;
  width: 64px;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  border-radius: 50%;
  cursor: pointer;
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
  const dispatch = useDispatch();
  const signinRef = useRef();
  const [userInfo, setUserInfo] = useState({});
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
    console.log(myUserId);
    console.log(queryUserId);
    console.log(id);

    if (myUserId && (queryUserId === myUserId || id === myUserId)) {
      history.push({ pathname: "mypage" });
    } else {
      db_userInfo
        .doc(id)
        .get()
        .then((doc) => {
          setUserInfo(doc.data());
        });
    }
  }, [myUserId, window.location.search, queryUserId]);

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

  function handleHome() {
    dispatch({
      type: "SET_TARGET_COUNTRY",
      payload: {},
    });
    history.push({ pathname: "home" });
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
            <div style={{ fontSize: 100 }}>{name}</div>
            <div style={{ fontSize: 30 }}>from</div>
            <CountryDiv>
              <MyCountryDiv>
                {country ? countryTrans[country].name_en : ""}
              </MyCountryDiv>
            </CountryDiv>
            <div
              style={{ fontSize: 30, marginBottom: "24px" }}
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
            <MyGallery title={"Albums"} id={userInfo.id} />
          ) : (
            <MyFriends title={"Friends"} userInfo={userInfo} />
          )}
        </BottomDiv>
        <ButtonsDiv>
          <HomeDiv onClick={handleHome}>
            <i className="fas fa-home"></i>
          </HomeDiv>
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
