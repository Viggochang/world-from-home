import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { useQuery } from "../../util/customHook";

import styled from "styled-components";
import { firebase } from "../../util/firebase";
import { setMyUserId, setUserInfo } from "../../util/redux/action";

import logoutImg from "../../image/logout.jpeg";
import { swalLogout } from "../../util/swal";

const LogoutDiv = styled.div`
  font-size: 36px;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  cursor: pointer;
  :hover {
    background-color: rgb(184, 195, 208, 0.3);
  }
`;

export default function Logout({ LogoutStyle, handleSaveLogout }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const albumIdEditing = useQuery().get("album_id_edit");

  function handleLogout() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        dispatch(setMyUserId(""));
        dispatch(setUserInfo({}));
      })
      .then(() => {
        swalLogout(logoutImg, () => {
          history.push({ pathname: "/" });
        });
      });
  }
  return (
    <LogoutDiv
      style={LogoutStyle}
      onClick={(e) => {
        if (albumIdEditing) {
          handleSaveLogout(e, albumIdEditing, handleLogout);
        } else {
          handleLogout();
        }
      }}
    >
      <i className="fas fa-sign-out-alt" />
    </LogoutDiv>
  );
}
