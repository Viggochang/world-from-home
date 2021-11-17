import React, { useState } from "react";
import { useHistory } from "react-router";
import { useSelector, useDispatch } from "react-redux";

import styled from "styled-components";
import { firebase } from "../../util/firebase";

import Background from "./background/Background";
import Photo from "./information/photo/Photo";
import ChangeBackground from "./information/changeBackground/ChangeBackground";
import Country from "./information/country/Country";
import MoreInformation from "./information/moreInformation/MoreInformation";

import MyGallery from "./component/MyGallery";
import MyFriends from "./component/MyFriends";
import AlbumFriendBtns from "./component/AlbumFriendBtns";
import Album from "../album/Album";
import Logout from "../Signin/Logout";

const MyPageDiv = styled.div`
  /* position: fixed;
  top: 0;
  left: 0; */
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

const UpperDiv = styled.div`
  display: flex;
  width: calc(100vw - 160px);
  max-width: 1500px;
  position: relative;
  @media (max-width: 932px) {
    flex-direction: column;
    align-items: center;
  }
  @media (max-width: 640px) {
    width: calc(100vw - 60px);
  }
`;

const UserInfoDiv = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
  margin-left: 40px;
  max-width: calc(100vw - 704px);
  font-weight: bold;
  line-height: 1.15;
  @media (max-width: 932px) {
    max-width: 500px;
    margin-left: 0;
  }
`;

const NameDiv = styled.div`
  font-size: 92px;
  @media (max-width: 1180px) {
    font-size: 64px;
  }
`;
const TextDiv = styled.div`
  font-size: 30px;
  @media (max-width: 1180px) {
    font-size: 24px;
  }
`;
const AgeDiv = styled.div`
  font-size: 30;
  margin-bottom: 22px;
  @media (max-width: 1180px) {
    font-size: 24px;
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
  @media (max-width: 932px) {
    flex-direction: row;
    position: absolute;
    top: -25px;
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

const LowerDiv = styled.div`
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

  const { id, name, country, photo, birthday, background_photo } = myInfo;
  console.log(id);
  firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      history.push({ pathname: "/" });
    }
  });
  // if (!id) {
  //   history.push({ pathname: "/" });
  // }

  const age =
    birthday &&
    new Date(birthday.seconds * 1000).toDateString() !==
      new Date(0).toDateString()
      ? new Date().getFullYear() -
        new Date(1000 * birthday.seconds).getFullYear()
      : "unknown";

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
        <UpperDiv>
          <Photo id={id} photo={photo} />
          <ChangeBackground id={id} />
          <UserInfoDiv>
            <NameDiv>{name}</NameDiv>
            <TextDiv>from</TextDiv>
            <Country country={country} />
            <AgeDiv>{`age: ${age}`}</AgeDiv>
            <MoreInformation />
          </UserInfoDiv>

          <ButtonsDiv>
            <HomeDiv onClick={handleHome}>
              <i className="fas fa-home"></i>
            </HomeDiv>
            <Logout />
          </ButtonsDiv>
        </UpperDiv>
        <LowerDiv>
          <AlbumFriendBtns
            activeButton={activeButton}
            setActiveButton={setActiveButton}
          />
          {activeButton === "Albums" ? (
            <MyGallery title={"My Albums"} id={id} isMyPage={true} />
          ) : (
            <MyFriends title={"My Friends"} userInfo={myInfo} isMyPage={true} />
          )}
        </LowerDiv>
      </MyPageDiv>
      <Album />
    </>
  );
}
