import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";

import styled from "styled-components";

import World from "../world/World";
import ToMyPage from "../world/component/ToMyPage";
import Country from "../country/Country";
import GalleryQuestion from "../country/component/GalleryQuestion";

const HomePageDiv = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #3A4A58;
`;

const BackBtn = styled.div`
  font-size: 20px;
  background-color: #d9d9d9;
  padding: 4px;
  position: absolute;
  bottom: 220px;
  right: 45px;
  color: #3A4A58;
  border-radius: 25%;
  outline: 2px solid #d9d9d9;
  cursor: pointer;
  :hover{
    background-color: #8E8E8E;
  }
`;

export default function HomePage() {
  const galleryQuestionRef = useRef();
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

  function handleMapBack() {
    map.goHome();
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
      <ToMyPage />
      <Country
        style={{
          visibility: maskVisibility,
          backgroundColor: `rgba(63, 63, 63, ${maskOpacity})`,
          display: maskDisplay,
          opacity: maskOpacity + 0.2,
        }}
        handleClickBack={handleClickBack}
        galleryQuestionRef={galleryQuestionRef}
      />
      <GalleryQuestion innerRef={galleryQuestionRef} />
    </HomePageDiv>
  );
}
