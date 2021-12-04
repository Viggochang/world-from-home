import React, { useState } from "react";
import styled from "styled-components";

import World from "./World";

const UserWorldDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100vw - 160px);
  max-width: 1500px;
  height: calc((100vw - 160px) * (4 / 7));
  max-height: 900px;
  margin-top: 40px;
  position: relative;
  @media (max-width: 640px) {
    width: calc(100vw - 60px);
    height: calc((100vw - 60px) * (4 / 7));
  }
`;

const Title = styled.div`
  color: white;
  font-size: 50px;
  font-weight: bold;
  margin-right: auto;
  position: absolute;
  bottom: 30px;
  left: 40px;
  z-index: 1;
  @media (max-width: 1080px) {
    font-size: 4vw;
    bottom: 2vw;
    left: 4vw;
  }
`;

const UserPageDiv = styled.div`
  width: calc(100% - 80px);
  height: 100%;
  margin-top: 10px;
  background-color: rgb(58, 74, 88);
  position: relative;
  @media (max-width: 932px) {
    width: 100%;
  }
  @media (max-width: 932px) {
    width: 100%;
  }
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
  outline: 2px solid #d9d9d9;
  cursor: pointer;
  :hover {
    background-color: #8e8e8e;
  }
`;

export default function UserWorld({ userInfo }) {
  const [maskVisibility, setMaskVisibility] = useState("hidden");
  const [maskOpacity, setMaskOpacity] = useState(0);
  const [map, setMap] = useState(undefined);
  const [currentActive, setCurrentActive] = useState({});

  function handleBack() {
    map.goHome();
    currentActive.isActive = false;
  }

  return (
    <UserWorldDiv>
      <Title>{`World from ${userInfo.name}`}</Title>
      <UserPageDiv>
        <World
          userInfo={userInfo}
          setCurrentActive={setCurrentActive}
          setMap={setMap}
          setMaskVisibility={setMaskVisibility}
          setMaskOpacity={setMaskOpacity}
          userPage={true}
          mapType={true}
        />
        <BackBtn onClick={handleBack}>
          <i className="fas fa-home" />
        </BackBtn>
      </UserPageDiv>
    </UserWorldDiv>
  );
}
