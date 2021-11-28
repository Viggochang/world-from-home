import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router";
import { useSelector, useDispatch } from "react-redux";

import styled from "styled-components";
import { getUserDataByUid } from "../../util/firebase";

import Background from "./personalInformation/background/Background";
import UserInformation from "./personalInformation/UserInformation";
import UserWorld from "./userWorld/UserWorld";
import { AlbumFriendBtn } from "../../util/muiButton";

import PersonalAlbum from "./personalAlbum/PersonalAlbum";
import PersonalFriends from "./personialFriend/PersonalFriends";

import Logout from "../Signin/Logout";
import Login from "../Signin/Signin";
import Album from "../album/Album";

const UserPageDiv = styled.div`
  padding: 50px 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(100vw - 160px);
  @media (max-width: 640px) {
    width: calc(100vw - 60px);
    padding: 50px 30px;
  }
`;

const AlbumFriendContainer = styled.div`
  display: flex;
  width: calc(100vw - 160px);
  max-width: 1500px;
  margin-top: 40px;
  @media (max-width: 932px) {
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
  }
  @media (max-width: 640px) {
    width: calc(100vw - 60px);
  }
`;

const AlbumFriendBtnsDiv = styled.div`
  display: flex;
  flex-direction: column;
  @media (max-width: 932px) {
    border-top: 1px white solid;
    padding: 20px 30px 0;
    width: calc(100% - 60px);
    flex-direction: row;
    justify-content: flex-start;
  }
  @media (max-width: 640px) {
    justify-content: center;
  }
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
  color: white;
  z-index: 2;
  @media (max-width: 932px) {
    flex-direction: row;
    position: absolute;
    top: 24px;
    left: calc(50% - 187.5px);
    align-items: center;
    min-width: 375px;
    right: calc(50% - 187.5px);
  }
  @media (max-width: 450px) {
    left: calc(50% - 150px);
    min-width: 300px;
    right: calc(50% - 150px);
  }
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
  @media (max-width: 932px) {
    margin-top: 10px;
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
  background-image: url(${(props) => props.photo});
  background-size: cover;
  background-position: center;
  :hover {
    background-color: #667484;
  }
  @media (max-width: 932px) {
    margin: 10px 0 0 183px;
  }
  @media (max-width: 450px) {
    margin: 10px 0 0 108px;
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

  const id = new URLSearchParams(window.location.search).get("id");

  useEffect(() => {
    async function getUserData(id) {
      if (myUserId && (queryUserId === myUserId || id === myUserId)) {
        history.push({ pathname: "mypage" });
      } else {
        const userData = await getUserDataByUid(id);
        if (!userData) {
          history.push({ pathname: "notfound" });
        } else {
          setUserInfo(userData);
        }
      }
    }
    getUserData(id);
  }, [myUserId, window.location.search, queryUserId]);

  const { background_photo } = userInfo;

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
      <UserPageDiv>
        <Login signinRef={signinRef} />
        <Background background_photo={background_photo} />
        <ButtonsDiv>
          <HomeDiv onClick={handleHome}>
            <i className="fas fa-home" />
          </HomeDiv>
          {myInfo.id && <Logout />}
          <MyPageIcon onClick={handleToMyPage} photo={myInfo.photo}>
            {myInfo.photo ? (
              <MyPageIconMask />
            ) : (
              <i className="fas fa-user-alt" />
            )}
          </MyPageIcon>
        </ButtonsDiv>

        <UserInformation userInfo={userInfo} />

        <UserWorld userInfo={userInfo} />

        <AlbumFriendContainer>
          <AlbumFriendBtnsDiv>
            {["Albums", "Friends"].map((btn) => (
              <AlbumFriendBtn
                key={btn}
                content={btn}
                activeButton={activeButton}
                onClick={() => setActiveButton(btn)}
              />
            ))}
          </AlbumFriendBtnsDiv>

          {activeButton === "Albums" ? (
            <PersonalAlbum title={"Albums"} id={userInfo.id} isMyPage={false} />
          ) : (
            <PersonalFriends
              title={"Friends"}
              userInfo={userInfo}
              isMyPage={false}
            />
          )}
        </AlbumFriendContainer>
      </UserPageDiv>

      <Album />
    </>
  );
}
