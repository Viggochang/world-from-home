import React from "react";
import { useSelector } from "react-redux";

import styled from "styled-components";

const Background = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
`;

const Mask = styled.div`
  width: 100vw;
  height: 100vh;
  background: rgb(142, 142, 142, 0.7);
`;

const SettingDiv = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  padding: 50px 80px;
  display: flex;
  flex-direction: column;
`;

const UpperDiv = styled.div`
  display: flex;
  width: calc(100vw - 160px);
  align-items: baseline;
  justify-content: center;
`;

const MyPhoto = styled.div`
  width: 350px;
  height: 350px;
  box-shadow: 0px 0px 20px #000000;
`;

const MyBackgroundPhoto = styled.div`
  width: 400px;
  height: 300px;
  box-shadow: 0px 0px 20px #000000;
  margin-left: 20px;
`;

export default function Setting() {
  const userInfo = useSelector((state) => state.userInfo);
  const { photo, background_photo } = userInfo;

  return (
    <>
      <Background
        style={{
          background: `url(${userInfo.background_photo})`,
          backgroundSize: "cover",
        }}
      >
        <Mask />
      </Background>
      <SettingDiv>
        <UpperDiv>
        <MyPhoto
            style={{
              backgroundImage: `url(${photo})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        <MyBackgroundPhoto
          style={{
              backgroundImage: `url(${background_photo})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
        >

        </MyBackgroundPhoto>
        </UpperDiv>
      </SettingDiv>
    </>
  );
}
