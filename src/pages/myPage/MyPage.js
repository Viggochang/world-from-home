import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

import styled from "styled-components";

import Background from "./background/Background";
import Photo from "./information/photo/Photo";
import ChangeBackground from "./information/changeBackground/ChangeBackground";
import Country from "./information/country/Country";
import MoreInformation from "./information/moreInformation/MoreInformation";

import MyGallery from "./component/MyGallery";
import MyFriends from "./component/MyFriends";
import AlbumFriendBtns from "./component/AlbumFriendBtns";
import Album from "../album/Album";

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

const UserInfoDiv = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
  margin-left: 40px;
  max-width: calc(100vw - 704px);
  font-weight: bold;
  line-height: 1.15;
`;

const ButtonsDiv = styled.div`
  display: flex;
  flex-direction: column;
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

const LowerDiv = styled.div`
  display: flex;
  width: calc(100vw - 160px);
  max-width: 1500px;
  margin-top: 40px;
`;

export default function MyPage() {
  const [activeButton, setActiveButton] = useState("Albums");
  const myInfo = useSelector((state) => state.userInfo);

  const { id, name, country, photo, birthday, background_photo } = myInfo;
  const age =
    birthday &&
    new Date(birthday.seconds * 1000).toDateString() !==
      new Date(0).toDateString()
      ? new Date().getFullYear() -
        new Date(1000 * birthday.seconds).getFullYear()
      : "unknown";

  return (
    <>
      <MyPageDiv>
        <Background background_photo={background_photo} />
        <UpperDiv>
          <Photo id={id} photo={photo} />
          <ChangeBackground id={id} />
          <UserInfoDiv>
            <div style={{ fontSize: 148 }}>{name}</div>
            <div style={{ fontSize: 36 }}>from</div>
            <Country country={country} />
            <div
              style={{ fontSize: 36, marginBottom: "22px" }}
            >{`age: ${age}`}</div>
            <MoreInformation />
          </UserInfoDiv>

          <ButtonsDiv>
            <HomeLink to="home">
              <i className="fas fa-home"></i>
            </HomeLink>
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
