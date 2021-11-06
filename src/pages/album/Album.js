import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { db_gallery, db_userInfo } from "../../util/firebase";

import ShowAlbum from "./component/ShowAlbum";
import { Tooltip } from "@mui/material";

const AlbumDiv = styled.div`
  width: calc(100vw - 200px);
  height: 100vh;
  background-color: rgb(0, 0, 0, 0.85);
  display: none;
  z-index: 5;
  position: fixed;
  top: 0;
  left: 0;
  flex-direction: column;
  padding: 40px 100px;
  overflow: scroll;
`;

const BackDiv = styled.div`
  position: fixed;
  top: 25px;
  right: 30px;
  color: white;
  font-weight: bold;
  font-size: 25px;
  cursor: pointer;
  :hover {
    color: #b8c3d0;
  }
`;

const ButtonsDiv = styled.div`
  position: fixed;
  top: 150px;
  right: 50px;
  display: flex;
  flex-direction: column;
`;

const ButtonStyle = styled.div`
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  font-size: 25px;
  color: #3a4a58;
  background-color: white;
  cursor: pointer;
  box-shadow: 0px 0px 10px #d0d0d0;
  :hover {
    color: #667484;
  }
`;

const AlbumInfo = styled.div`
  display: flex;
  align-items: center;
`;

const AlbumOwner = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 10px;
  cursor: pointer;
`;

const AlbumPositionData = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
`;

const AlbumPosition = styled.div`
  margin-left: 5px;
  font-weight: bold;
  font-size: 30px;
  line-height: 40px;
`;

const AlbumDate = styled.div`
  margin-left: 5px;
  font-size: 20px;
  line-height: 30px;
`;

export default function Album() {
  const albumIdShow = useSelector((state) => state.albumIdShow);
  const userInfo = useSelector((state) => state.userInfo);
  const history = useHistory();
  const dispatch = useDispatch();
  const [albumData, setAlbumData] = useState({});
  const [ownerPhoto, setOwnerPhoto] = useState("");
  const [ownerId, setOwnerId] = useState("");

  const { content, position, timestamp, user_id } = albumData || {};

  useEffect(() => {
    console.log(albumIdShow);
    if (albumIdShow) {
      db_gallery
        .doc(albumIdShow)
        .get()
        .then((doc) => {
          let albumData = doc.data();
          setAlbumData(albumData);
          db_userInfo
            .doc(albumData.user_id)
            .get()
            .then((doc) => {
              setOwnerPhoto(doc.data().photo);
              setOwnerId(doc.data().id);
            });
        });
    }
  }, [albumIdShow]);

  function handleClickBack() {
    let params = new URL(window.location).searchParams;
    params.delete("album_id_show");
    history.push({
      search: params.toString(),
    });

    dispatch({ type: "SET_ALBUM_ID_SHOW", payload: "" });
    setAlbumData({});
    setOwnerPhoto("");
    setOwnerId("");
  }

  return (
    <AlbumDiv style={{ display: albumIdShow ? "flex" : "none" }}>
      <BackDiv onClick={handleClickBack}>
        <i className="fas fa-times"></i>
      </BackDiv>
      <ButtonsDiv>
        <Tooltip title="Like" placement="left">
          <ButtonStyle>
            <i className="fas fa-thumbs-up" />
          </ButtonStyle>
        </Tooltip>
        <Tooltip
          title="Add Friend"
          placement="left"
          style={{ display: userInfo.id === ownerId ? "none" : "flex" }}
        >
          <ButtonStyle>
            <i className="fas fa-user-plus"></i>
          </ButtonStyle>
        </Tooltip>
        <Tooltip
          title="Edit"
          placement="left"
          style={{ display: userInfo.id === ownerId ? "flex" : "none" }}
        >
          <ButtonStyle>
            <i className="fas fa-pencil-alt" />
          </ButtonStyle>
        </Tooltip>
        <Tooltip
          title="Delete"
          placement="left"
          style={{ display: userInfo.id === ownerId ? "flex" : "none" }}
        >
          <ButtonStyle>
            <i className="fas fa-trash-alt"></i>
          </ButtonStyle>
        </Tooltip>
      </ButtonsDiv>

      <AlbumInfo>
        <AlbumOwner
          style={{
            backgroundImage: `url(${ownerPhoto})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          onClick={() => {
            history.push({
              pathname: "user",
              search: `?id=${albumData.user_id}`,
            });
          }}
        />
        <AlbumPositionData>
          <AlbumPosition>
            <i className="fas fa-map-pin" />
            &ensp;{albumData.position}
          </AlbumPosition>
          <AlbumDate>
            <i className="far fa-calendar-alt" />
            &ensp;
            {albumData.timestamp
              ? new Date(albumData.timestamp.seconds * 1000).toDateString()
              : ""}
          </AlbumDate>
        </AlbumPositionData>
      </AlbumInfo>
      <ShowAlbum show={true} albumContent={albumData.content} />
    </AlbumDiv>
  );
}
