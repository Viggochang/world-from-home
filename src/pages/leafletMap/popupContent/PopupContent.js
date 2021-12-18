import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useShowAlbum } from "../../../util/customHook";

import styled from "styled-components";
import { getAlbumDataById, getUserDataByUid } from "../../../util/firebase";

const PopupContentDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  z-index: 3;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #3a4a58;
  @media (max-width: 600px) {
    font-size: 16px;
  }
`;

const AlbumPhoto = styled.div`
  width: 360px;
  height: 250px;
  display: flex;
  margin-top: 10px;
  cursor: pointer;
  background-image: ${(props) => `url(${props.photo})`};
  background-position: center;
  background-size: cover;
  @media (max-width: 600px) {
    width: 240px;
    height: 160px;
  }
`;

const AlbumOwnerPhoto = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin: 55px 20px;
  position: absolute;
  bottom: 135px;
  left: 285px;
  box-shadow: rgba(255, 255, 255, 0.6) 0px 10px 27px -5px,
    rgba(255, 255, 255, 0.6) 0px 16px 16px -8px;
  cursor: pointer;
  background-image: ${(props) => `url(${props.photo})`};
  background-position: center;
  background-size: cover;
  @media (max-width: 600px) {
    width: 40px;
    height: 40px;
    bottom: 65px;
    left: 180px;
  }
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
  const history = useHistory();

  useEffect(() => {
    async function getPopupContent() {
      const albumData = await getAlbumDataById(spot.album_id);
      const albumOwnerData = await getUserDataByUid(albumData.user_id);
      setAlbum(albumData);
      setAlbumOwner(albumOwnerData);
    }
    getPopupContent();
  }, [spot]);

  const handleShowAlbumId = useShowAlbum();

  function handleUserPage(id) {
    history.push({
      pathname: "user",
      search: `?id=${id}`,
    });
  }

  return (
    <PopupContentDiv>
      <Title>
        <i className="fas fa-map-marker-alt" />
        &ensp;
        {spot.text}
      </Title>
      <AlbumPhoto
        photo={album.cover_photo}
        onClick={() => handleShowAlbumId("album_id_show", spot.album_id)}
      ></AlbumPhoto>
      <AlbumOwnerPhoto
        photo={albumOwner.photo}
        onClick={() => handleUserPage(albumOwner.id)}
      >
        <Mask />
      </AlbumOwnerPhoto>
    </PopupContentDiv>
  );
}
