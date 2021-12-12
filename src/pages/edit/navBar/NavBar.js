import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

import Logout from "../../signin/Logout";

const NavBarNav = styled.nav`
  font-size: 30px;
  width: 100vw;
  height: 72px;
  position: fixed;
  top: 0;
  background-color: #667484;
  z-index: 1;
  display: flex;
  align-items: center;
  color: white;
`;
const MyPageDiv = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  box-shadow: 0px 0px 10px #bebebe;
  margin-right: auto;
  margin-left: 20px;
  cursor: pointer;
  background-image: url(${(props) => props.photo});
  background-size: cover;
  background-position: center;
`;
const MyPageIconMask = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: rgb(225, 225, 225, 0);
  :hover {
    background-color: rgb(225, 225, 225, 0.2);
  }
`;

const HomeDiv = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  margin-left: 20px;
  margin-right: 20px;
  color: white;
  cursor: pointer;
  :hover {
    background-color: rgb(255, 255, 255, 0.3);
  }
`;

const LogoutStyle = {
  margin: "0 20px 0 0",
  width: "50px",
  height: "50px",
};

export default function NavBar({ saveAlertRef, saveEditing, saveCanvasToImg }) {
  const myInfo = useSelector((state) => state.userInfo);
  const albumIdEditing = useSelector((state) => state.albumIdEditing);
  const dispatch = useDispatch();
  const history = useHistory();

  async function handleMyPage(e, albumId) {
    saveAlertRef.current.style.zIndex = 5;
    await saveEditing(albumId);
    await saveCanvasToImg(albumId);
    dispatch({
      type: "DISCARD_CANVAS_EDIT",
      payload: "",
    });
    history.push({ pathname: "mypage" });
  }

  async function handleHome(e, albumId) {
    saveAlertRef.current.style.zIndex = 5;
    await saveEditing(albumId);
    await saveCanvasToImg(albumId);
    dispatch({
      type: "DISCARD_CANVAS_EDIT",
      payload: "",
    });
    history.push({ pathname: "home" });
  }

  async function handleSaveLogout(e, albumId, logout) {
    saveAlertRef.current.style.zIndex = 5;
    await saveEditing(albumId);
    await saveCanvasToImg(albumId);
    dispatch({
      type: "DISCARD_CANVAS_EDIT",
      payload: "",
    });
    logout();
  }

  return (
    <NavBarNav>
      <MyPageDiv
        photo={myInfo.photo}
        onClick={(e) => handleMyPage(e, albumIdEditing)}
      >
        <MyPageIconMask />
      </MyPageDiv>
      <HomeDiv onClick={(e) => handleHome(e, albumIdEditing)}>
        <i className="fas fa-home" />
      </HomeDiv>
      <Logout
        LogoutStyle={LogoutStyle}
        handleSaveLogout={handleSaveLogout}
        albumIdEditing={albumIdEditing}
      />
    </NavBarNav>
  );
}
