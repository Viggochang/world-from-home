import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const ToMyPageDiv = styled.div`
  position: absolute;
  bottom: 40px;
  left: 40px;
  /* z-index: 2; */
  display: flex;
  align-items: baseline;
`;

const MyPhoto = styled(NavLink)`
  /* background-color: white; */
  width: 100px;
  height: 100px;
  box-shadow: 0px 0px 5px #8E8E8E;
`;

const MyName = styled.div`
  color: white;
  font-size: 70px;
  padding-left: 30px;
`;

export default function ToMyPage() {
  const userInfo = useSelector((state) => state.userInfo);

  return (
    <ToMyPageDiv>
      <MyPhoto
        to="/mypage"
        style={{
          backgroundImage: `url(${userInfo.photo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <MyName>World from {userInfo.name}</MyName>
    </ToMyPageDiv>
  );
}
