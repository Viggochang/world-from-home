import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import styled from "styled-components";

import MyTooltip from "../../util/muiTooltips";

import World from "../world/World";
import LeafletMap from "../leafletMap/LeafletMap";
import ToMyPage from "../world/component/ToMyPage";
import Search from "../world/component/Search";
import Country from "../country/Country";
import SigninDiv from "../signin/Signin";
import Album from "../album/Album";
import MapSwitch from "./MapSwitch";
import Logout from "../signin/Logout";

const HomePageDiv = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #3a4a58;
`;

const BackBtn = styled.div`
  font-size: 20px;
  background-color: #d9d9d9;
  padding: 4px;
  position: absolute;
  bottom: 120px;
  right: 45px;
  color: #3a4a58;
  border-radius: 25%;
  outline: 2px solid #ffffff;
  cursor: pointer;
  z-index: 1;
  display: ${(props) => (props.type === "true" ? "block" : "none")};
  :hover {
    background-color: #bebebe;
  }
`;

const Title = styled.div`
  max-width: calc(100% - 120px);
  font-size: 70px;
  letter-spacing: 2px;
  font-weight: bold;
  margin-right: auto;
  position: absolute;
  bottom: 40px;
  left: 60px;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  color: ${(props) => (props.type === "true" ? "white" : "#3A4A58")};
  @media (max-width: 920px) {
    font-size: 50px;
    left: 50px;
  }
  @media (max-width: 720px) {
    font-size: 30px;
    left: 30px;
  }
`;

const LogoutDiv = styled.div`
  position: fixed;
  bottom: 160px;
  right: 26px;
  z-index: 1;
  opacity: 0.8;
  color: ${(props) => (props.type === "true" ? "white" : "#3a4a58")};
`;

export default function HomePage({ mapType, setMapType }) {
  const signinRef = useRef();
  const userInfo = useSelector((state) => state.userInfo);
  const albumIdShow = useSelector((state) => state.albumIdShow);

  const [maskVisibility, setMaskVisibility] = useState("hidden");
  const [maskOpacity, setMaskOpacity] = useState(0);
  const [maskDisplay, setMaskDisplay] = useState("flex");
  const [map, setMap] = useState(undefined);

  const dispatch = useDispatch();

  function showCountry(currentActive) {
    dispatch({
      type: "SET_TARGET_COUNTRY",
      payload: currentActive.dataItem.dataContext,
    });
    setMaskOpacity(0.8);
    setMaskVisibility("visible");
  }

  function handleClickBack() {
    map.goHome();
    dispatch({
      type: "SET_TARGET_COUNTRY",
      payload: {},
    });
    setMaskOpacity(0);
    setMaskVisibility("hidden");
    setMaskDisplay("none");
    setTimeout(() => {
      setMaskDisplay("flex");
    }, 2000);
  }

  function handleSignIn() {
    signinRef.current.style.zIndex = 2;
  }

  function handleEsc(event) {
    if (event.key === "Escape") {
      if (!albumIdShow) {
        handleClickBack();
      }
    }
  }

  return (
    <HomePageDiv onKeyDown={handleEsc} tabIndex="0">
      <LeafletMap mapType={mapType} />
      <World
        userInfo={userInfo}
        mapType={mapType}
        setMap={setMap}
        map={map}
        showCountry={showCountry}
        userPage={false}
      />
      <Title type={mapType.toString()}>{`World from ${
        userInfo.name || "Guest"
      }`}</Title>

      <MapSwitch setMapType={setMapType} mapType={mapType} />

      <BackBtn type={mapType.toString()} onClick={handleClickBack}>
        <i className="fas fa-home" />
      </BackBtn>

      <Search map={map} mapType={mapType} showCountry={showCountry} />
      <ToMyPage handleSignIn={handleSignIn} />
      <SigninDiv signinRef={signinRef} />
      <MyTooltip
        styleParams={{ fontSize: 14, opacity: 0.9 }}
        title="Log out"
        placement="left"
        content={
          <LogoutDiv type={mapType.toString()}>
            <Logout />
          </LogoutDiv>
        }
      />

      <Country
        styleParams={{ maskVisibility, maskOpacity, maskDisplay }}
        handleClickBack={handleClickBack}
        signinRef={signinRef}
      />
      <Album />
    </HomePageDiv>
  );
}
