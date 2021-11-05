import React from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

const AlbumDiv = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: rgb(0, 0, 0, 0.8);
  display: none;
  z-index: 5;
  position: fixed;
  top: 0;
  left: 0;
`;

const BackDiv = styled.div`
  position: absolute;
  top: 15px;
  right: 20px;
  color: white;
  font-weight: bold;
  font-size: 25px;
  cursor: pointer;
  :hover {
    color: #b8c3d0;
  }
`;

export default function Album() {
  const albumIdShow = useSelector((state) => state.albumIdShow);
  const history = useHistory();
  const dispatch = useDispatch();

  function handleClickBack() {
    let params = new URL(window.location).searchParams;
    params.delete("album_id_show");
    history.push({
      search: params.toString(),
    });
    dispatch({ type: "SET_ALBUM_ID_SHOW", payload: "" });
  }

  return (
    <AlbumDiv style={{ display: albumIdShow ? "flex" : "none" }}>
      <BackDiv onClick={handleClickBack}>
        <i className="fas fa-times"></i>
      </BackDiv>
    </AlbumDiv>
  );
}
