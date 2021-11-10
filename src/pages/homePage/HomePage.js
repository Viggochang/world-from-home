import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";

import styled from "styled-components";

import World from "../world/World";
import ToMyPage from "../world/component/ToMyPage";
import Search from "../world/component/Search";
import Country from "../country/Country";
// import GalleryQuestion from "../country/component/GalleryQuestion";
import SigninDiv from "../Signin/Signin";
import Album from "../album/Album";

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
  outline: 2px solid #d9d9d9;
  cursor: pointer;
  :hover {
    background-color: #8e8e8e;
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

  function handleClickBack() {
    map.goHome();
    // polygonSeries.getPolygonById(`${currentActive.dataItem.dataContext.id}`).isActive = false;
    currentActive.isActive = false;
    setMaskOpacity(0);
    setMaskVisibility("hidden");
    setMaskDisplay("none");
    setTimeout(() => {
      setMaskDisplay("flex");
    }, 2000);
  }

  function handleSignIn() {
    signinRef.current.style.display = "flex";
    console.log("sign in");
  }

  return (
    <HomePageDiv>
      <World
        userInfo={userInfo}
        setCurrentActive={setCurrentActive}
        setMap={setMap}
        setMaskVisibility={setMaskVisibility}
        setMaskOpacity={setMaskOpacity}
      />
      <BackBtn onClick={handleClickBack}>
        <i className="fas fa-home"></i>
      </BackBtn>

      <ToMyPage handleSignIn={handleSignIn} />
      <Search
        setMaskVisibility={setMaskVisibility}
        setMaskOpacity={setMaskOpacity}
        map={map}
        setCurrentActive={setCurrentActive}
      />
      <Title>{`World  from  ${userInfo.name || "Guest"}`}</Title>
      <Country
        style={{
          visibility: maskVisibility,
          backgroundColor: `rgba(63, 63, 63, ${maskOpacity})`,
          display: maskDisplay,
          opacity: maskOpacity + 0.2,
        }}
        handleClickBack={handleClickBack}
      />
      {/* <GalleryQuestion innerRef={galleryQuestionRef} /> */}
      <SigninDiv innerRef={signinRef} />
      <Album />
    </HomePageDiv>
  );
}
