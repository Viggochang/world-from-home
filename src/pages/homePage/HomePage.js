import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import styled from "styled-components";

import World from "../world/World";
import LeafletMap from "../leafletMap/LeafletMap";
import ToMyPage from "../world/component/ToMyPage";
import Search from "../world/component/Search";
import Country from "../country/Country";
// import GalleryQuestion from "../country/component/GalleryQuestion";
import SigninDiv from "../Signin/Signin";
import Album from "../album/Album";
import MapSwitch from "./MapSwitch";

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
  bottom: 220px;
  right: 45px;
  color: #3a4a58;
  border-radius: 25%;
  outline: 2px solid #ffffff;
  cursor: pointer;
  z-index: 1;
  :hover {
    background-color: #bebebe;
  }
`;

const Title = styled.div`
  color: white;
  font-size: 70px;
  letter-spacing: 2px;
  font-weight: bold;
  margin-right: auto;
  position: absolute;
  bottom: 40px;
  left: 60px;
  z-index: 1;
`;

export default function HomePage() {
  const galleryQuestionRef = useRef();
  const signinRef = useRef();
  const userInfo = useSelector((state) => state.userInfo);

  const [maskVisibility, setMaskVisibility] = useState("hidden");
  const [maskOpacity, setMaskOpacity] = useState(0);
  const [maskDisplay, setMaskDisplay] = useState("flex");
  const [map, setMap] = useState(undefined);
  const [currentActive, setCurrentActive] = useState({});
  const [mapType, setMapType] = useState(true);

  const dispatch = useDispatch();

  function handleClickBack() {
    map.goHome();
    // polygonSeries.getPolygonById(`${currentActive.dataItem.dataContext.id}`).isActive = false;
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

    console.log(currentActive);
    // currentActive.isActive = false;
  }

  function handleSignIn() {
    signinRef.current.style.zIndex = 2;
    console.log("sign in");
  }

  function handleEsc(event) {
    console.log(event.key);
    if (event.key === "Escape") {
      handleClickBack();
    }
  }

  return (
    <HomePageDiv onKeyDown={handleEsc} tabIndex="0">
      <MapSwitch setMapType={setMapType} mapType={mapType} />
      <LeafletMap mapType={mapType} />
      <World
        mapType={mapType}
        userInfo={userInfo}
        setCurrentActive={setCurrentActive}
        currentActive={currentActive}
        setMap={setMap}
        setMaskVisibility={setMaskVisibility}
        setMaskOpacity={setMaskOpacity}
        map={map}
      />
      <ToMyPage handleSignIn={handleSignIn} />
      <Title style={{ color: mapType ? "white" : "#3A4A58" }}>
        {`World  from  ${userInfo.name || "Guest"}`}
      </Title>

      <BackBtn
        style={{ display: mapType ? "block" : "none" }}
        onClick={handleClickBack}
      >
        <i className="fas fa-home"></i>
      </BackBtn>

      <Search
        setMaskVisibility={setMaskVisibility}
        setMaskOpacity={setMaskOpacity}
        map={map}
        setCurrentActive={setCurrentActive}
        mapType={mapType}
      />
      <Country
        style={{
          visibility: maskVisibility,
          backgroundColor: `rgba(63, 63, 63, ${maskOpacity})`,
          display: maskDisplay,
          opacity: maskOpacity + 0.2,
        }}
        handleClickBack={handleClickBack}
        signinRef={signinRef}
      />
      <SigninDiv signinRef={signinRef} />
      <Album />
    </HomePageDiv>
  );
}
