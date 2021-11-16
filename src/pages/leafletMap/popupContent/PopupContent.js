import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import styled from "styled-components";
import { db_gallery, db_userInfo } from "../../../util/firebase";

const PopupContentDiv = styled.div`
  /* width: 500px;
  height: 400px; */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  z-index: 3;
`;

const Title = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #3a4a58;
`;

const AlbumPhoto = styled.div`
  width: 400px;
  height: 270px;
  display: flex;
  margin-top: 10px;
  cursor: pointer;
`;

const AlbumOwnerPhoto = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin: 55px 20px;
  position: absolute;
  bottom: 150px;
  left: 320px;
  /* box-shadow: rgba(255, 255, 255, 0.7) 0px 8px 24px; */
  box-shadow: rgba(255, 255, 255, 0.6) 0px 10px 27px -5px,
    rgba(255, 255, 255, 0.6) 0px 16px 16px -8px;
  /* outline: 2px #b8c3d0 solid; */
  cursor: pointer;
`;

const Mask = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  :hover {
    background-color: rgb(255, 255, 255, 0.2);
  }
`;

export default function PopupContent({ spot }) {
  const [album, setAlbum] = useState({});
  const [albumOwner, setAlbumOwner] = useState({});
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    db_gallery
      .doc(spot.album_id)
      .get()
      .then((doc) => {
        setAlbum(doc.data());
        db_userInfo
          .doc(doc.data().user_id)
          .get()
          .then((doc) => {
            setAlbumOwner(doc.data());
          });
      });
  }, [spot]);

  function handleShowAlbumId(key, value) {
    let params = new URL(window.location).searchParams;
    params.append(key, value);
    history.push({ search: params.toString() });

    dispatch({
      type: "SET_ALBUM_ID_SHOW",
      payload: value,
    });
  }

  function handleUserPage(id) {
    history.push({
      pathname: "user",
      search: `?id=${id}`,
    });
  }

  return (
    <PopupContentDiv>
      <Title>{spot.text}</Title>
      <AlbumPhoto
        style={{
          backgroundImage: `url(${album.cover_photo})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
        onClick={() => handleShowAlbumId("album_id_show", spot.album_id)}
      ></AlbumPhoto>
      <AlbumOwnerPhoto
        style={{
          backgroundImage: `url(${albumOwner.photo})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
        onClick={() => handleUserPage(albumOwner.id)}
      >
        <Mask />
      </AlbumOwnerPhoto>
    </PopupContentDiv>
  );
}
