import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const MyPhoto = styled(NavLink)`
  width: 60px;
  height: 60px;
  box-shadow: 0px 0px 10px #bebebe;
  outline: 3px #b8c3d0 solid;
  position: absolute;
  top: 40px;
  right: 40px;
  border-radius: 20px;
  cursor: pointer;
  z-index: 2;
  :hover {
    box-shadow: 0px 0px 16px #bebebe;
  }
`;

const GuestIcon = styled.div`
  width: 60px;
  height: 60px;
  box-shadow: 0px 0px 5px #8e8e8e;
  outline: 4px white solid;
  border-radius: 20px;
  cursor: pointer;
  position: absolute;
  top: 40px;
  right: 40px;
  background-color: #b8c3d0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 40px;
  z-index: 2;
  :hover {
    box-shadow: 0px 0px 20px #bebebe;
  }
`;

export default function ToMyPage({ handleSignIn, style }) {
  const userInfo = useSelector((state) => state.userInfo);
  if (userInfo.photo) {
    return (
      <MyPhoto
        to="/mypage"
        style={{
          backgroundImage: `url(${userInfo.photo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          ...style,
        }}
      />
    );
  } else {
    return (
      <GuestIcon style={style} onClick={handleSignIn}>
        <i className="fas fa-user-alt" />
      </GuestIcon>
    );
  }
}
