import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

import { db_userInfo } from "../../../util/firebase";

const AlbumHere = styled.div`
  width: 50%;
  width: 500px;
  margin: 0 10px;
  color: #3a4a58;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
`;

const AlbumInfo = styled.div`
  display: flex;
  align-items: center;
`;

const AlbumOwner = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 10px;
  cursor: pointer;
`;

const AlbumPositionData = styled.div`
  display: flex;
  flex-direction: column;
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
const AlbumPhoto = styled.div`
  width: 500px;
  height: 65%;
  cursor: pointer;
  margin-top: 10px;
  cursor: pointer;
`;
const AlbumPraise = styled.div`
  margin: 10px 5px 0 auto;
  font-size: 20px;
  line-height: 30px;
`;

export default function Album({ album }) {
  const [ownerPhoto, setOwnerPhoto] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    db_userInfo
      .doc(album.user_id)
      .get()
      .then((doc) => {
        setOwnerPhoto(doc.data().photo);
      });
  }, []);

  function handleShowAlbumId(key, value) {
    let params = new URL(window.location).searchParams;
    params.append(key, value);
    history.push({ search: params.toString() });

    dispatch({
      type: "SET_ALBUM_ID_SHOW",
      payload: value,
    });
  }

  return (
    <AlbumHere key={album.id}>
      <AlbumInfo>
        <AlbumOwner
          style={{
            backgroundImage: `url(${ownerPhoto})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          onClick={() => {
            history.push({ pathname: "user", search: `?id=${album.user_id}` });
          }}
        />
        <AlbumPositionData>
          <AlbumPosition>
            <i className="fas fa-map-pin" />
            &ensp;{album.position}
          </AlbumPosition>
          <AlbumDate>
            <i className="far fa-calendar-alt" />
            &ensp;
            {new Date(album.timestamp.seconds * 1000).toDateString()}
          </AlbumDate>
        </AlbumPositionData>
      </AlbumInfo>
      <AlbumPhoto
        style={{
          backgroundImage: `url(${album.cover_photo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        onClick={() => handleShowAlbumId("album_id_show", album.id)}
      />
      <AlbumPraise>
        <i className="fas fa-heart"></i> {album.praise.length}
      </AlbumPraise>
    </AlbumHere>
  );
}
