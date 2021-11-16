import React, { useState } from "react";

import styled from "styled-components";

import World from "../../world/World";
// import ToMyPage from "../world/component/ToMyPage";
// import Country from "../country/Country";
// import GalleryQuestion from "../country/component/GalleryQuestion";

const UserPageDiv = styled.div`
  width: calc(100% - 80px);
  height: 100%;
  margin-top: 10px;
  background-color: rgb(58, 74, 88);
  position: relative;
  /* background-color: rgb(200, 200, 200, 0.5) ; */
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

export default function UserWorld({ userInfo }) {
  const [maskVisibility, setMaskVisibility] = useState("hidden");
  const [maskOpacity, setMaskOpacity] = useState(0);
  const [maskDisplay, setMaskDisplay] = useState("flex");
  const [map, setMap] = useState(undefined);
  const [currentActive, setCurrentActive] = useState({});

  function handleBack() {
    map.goHome();
    currentActive.isActive = false;
  }

  return (
    <UserPageDiv>
      <World
        userInfo={userInfo}
        setCurrentActive={setCurrentActive}
        setMap={setMap}
        setMaskVisibility={setMaskVisibility}
        setMaskOpacity={setMaskOpacity}
        userPage={true}
      />
      <BackBtn onClick={handleBack}>
        <i className="fas fa-home"></i>
      </BackBtn>
    </UserPageDiv>
  );
}
