import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import TextField from "@mui/material/TextField";

import styled from "styled-components";

import { db_userInfo } from "../../../util/firebase";

const MoreInfoDiv = styled.div`
  color: white;
  width: 320px;
  height: auto;
  background-color: rgb(255, 255, 255, 0.7);
  box-shadow: 0px 0px 20px #4f4f4f;
  z-index: 2;
  display: none;
  position: absolute;
  right: 90px;
  padding: 30px;
  flex-direction: column;
  align-items: flex-start;
`;

const CloseDiv = styled.div`
  color: #9D9D9D;
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 26px;
  cursor: pointer;
  :hover {
    color: #3a4a58;
  }
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: bold;
  line-height: 28px;
  padding: 0 12px;
  border-radius: 14px;
  background-color: #3a4a58;
  margin-bottom: 10px;
`;

const InfoTextDiv = styled.div`
  font-size: 20px;
  margin-bottom: 20px;
  color: #3a4a58;
  padding-left: 5px;
`;

const IntroductionDiv = styled.div`
  width: 100%;
  height: 89px;
  color: #3a4a58;
  overflow: scroll;
  padding-left: 5px;
  font-size: 20px;
  line-height: 30px;
`;

export default function MoreInfo({ innerRef, userInfo, handleMoreInfo }) {
  // const userInfo = useSelector((state) => state.userInfo);

  const { email, language, introduction } = userInfo;
  const birthdayFormat = userInfo.birthday
    ? new Date(userInfo.birthday.seconds * 1000).toDateString().slice(4)
    : "";

  function handleCloseMoreInfo() {
    innerRef.current.style.display = "none";
  }

  const infoData = [
    { title: "Email", info_data: email },
    { title: "Language", info_data: language },
    { title: "Birthday", info_data: birthdayFormat },
    { title: "Introduction", info_data: <IntroductionDiv>{introduction}</IntroductionDiv> },
  ];
  return (
    <MoreInfoDiv ref={innerRef}>
      <CloseDiv
        onClick={() => {
          handleCloseMoreInfo();
          handleMoreInfo();
        }}
      >
        <i className="fas fa-times-circle"></i>
      </CloseDiv>
      {infoData.map((info, index) => {
        const {title, info_data} = info;
        return(
          <div key={index}>
            <Title>{title}</Title>
            <InfoTextDiv>{info_data}</InfoTextDiv>
          </div>
        )
      })}
    </MoreInfoDiv>
  );
}
