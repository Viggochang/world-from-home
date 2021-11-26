import React, { useState } from "react";
import { useHistory } from "react-router";
import { useSelector, useDispatch } from "react-redux";

import styled from "styled-components";
import { firebase } from "../../util/firebase";

import Background from "./personalInformation/background/Background";
import MyInformation from "./personalInformation/MyInformation";
import AlbumFriendBtns from "./AlbumFriendBtns";

import PersonalAlbum from "./personalAlbum/PersonalAlbum";
import PersonalFriends from "./personialFriend/PersonalFriends";

import Album from "../album/Album";
import Logout from "../Signin/Logout";

const MyPageDiv = styled.div`
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

const ButtonsDiv = styled.div`
  display: flex;
  flex-direction: column;
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
  }
  @media (max-width: 450px) {
    left: calc(50% - 150px);
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

export default function MyPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [activeButton, setActiveButton] = useState("Albums");
  const myInfo = useSelector((state) => state.userInfo);

  const { id, background_photo } = myInfo;
  console.log(id);
  firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      history.push({ pathname: "/" });
    }
  });

  function handleHome() {
    dispatch({
      type: "SET_TARGET_COUNTRY",
      payload: {},
    });
    history.push({ pathname: "home" });
  }

  return (
    <>
      <MyPageDiv>
        <Background background_photo={background_photo} />
        <ButtonsDiv>
          <HomeDiv onClick={handleHome}>
            <i className="fas fa-home" />
          </HomeDiv>
          <Logout />
        </ButtonsDiv>

        <MyInformation />

        <AlbumFriendContainer>
          <AlbumFriendBtns
            activeButton={activeButton}
            setActiveButton={setActiveButton}
          />
          {activeButton === "Albums" ? (
            <PersonalAlbum title={"My Albums"} id={id} isMyPage={true} />
          ) : (
            <PersonalFriends
              title={"My Friends"}
              userInfo={myInfo}
              isMyPage={true}
            />
          )}
        </AlbumFriendContainer>
      </MyPageDiv>

      <Album />
    </>
  );
}
