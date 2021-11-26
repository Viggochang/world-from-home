import React from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { useHistory } from "react-router";
import { firebase } from "../../util/firebase";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import logoutImg from "../../image/logout.jpeg";

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

export default function Logout({
  LogoutStyle,
  handleSaveLogout,
  albumIdEditing,
}) {
  const history = useHistory();
  const dispatch = useDispatch();

  function handleLogout() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        dispatch({
          type: "SET_MY_USER_ID",
          payload: "",
        });
        dispatch({
          type: "SET_USER_INFO", // 使用者的資訊
          payload: {},
        });
      })
      .then(() => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
          title: "Logged Out !",
          text: "The most beautiful thing in the world is, of course, the world itself",
          imageUrl: logoutImg,
          imageWidth: 400,
          imageHeight: 200,
          imageAlt: "logged out",
        }).then(() => {
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
      <i className="fas fa-sign-out-alt"></i>
    </LogoutDiv>
  );
}
