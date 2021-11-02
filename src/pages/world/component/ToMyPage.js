import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const MyPhoto = styled(NavLink)`
  /* background-color: white; */
  width: 100px;
  height: 100px;
  box-shadow: 0px 0px 5px #8e8e8e;
  outline: 4px #b8c3d0 solid;
  position: absolute;
  top: 40px;
  right: 40px;
  border-radius: 50%;
  cursor: pointer;
`;

const GuestIcon = styled.div`
  width: 100px;
  height: 100px;
  box-shadow: 0px 0px 5px #8e8e8e;
  outline: 4px white solid;
  border-radius: 50%;
  cursor: pointer;
  position: absolute;
  top: 40px;
  right: 40px;
  background-color: #b8c3d0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 75px;
`;

export default function ToMyPage({ handleSignIn }) {
  const userInfo = useSelector((state) => state.userInfo);
  // console.log(userInfo);
  if (userInfo.photo) {
    return (
      <MyPhoto
        to="/mypage"
        style={{
          backgroundImage: `url(${userInfo.photo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    );
  } else {
    return (
      <GuestIcon onClick={handleSignIn}>
        <i className="fas fa-user-alt"></i>
      </GuestIcon>
    );
  }
}
