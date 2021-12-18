import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

import MediaMessage from "../../edit/mediaMessage/MediaMessage";

import {
  db_gallery,
  setAlbumDataIntoDb,
  onSnapshotAlbumByCountry,
} from "../../../util/firebase";
import { AddAlbumBtn } from "../../../util/muiButton";

import Album from "./Album";

const GalleryBackgroundDiv = styled.div`
  width: calc(65% - 80px);
  margin-left: 20px;
  height: calc(57% - 40px);
  background-color: #e0e0e0;
  padding: 20px;
  display: flex;
  border-radius: 8px;
  @media (max-width: 1180px) {
    width: calc(100% - 20px);
    height: calc(57% - 134px);
    margin-left: 0;
    padding: 20px 10px;
    order: -1;
  }
  @media (max-width: 600px) {
    height: 50%;
  }
`;

const Country = styled.div`
  display: none;
  font-weight: bold;
  font-size: 60px;
  color: white;
  margin: 0 0 10px 0;
  @media (max-width: 1180px) {
    display: flex;
    order: -2;
  }
`;

const AlbumDiv = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  overflow: scroll;
`;

const AlbumHere = styled.div`
  width: 500px;
  margin: 0 10px;
  color: #3a4a58;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
`;

const AlbumAdd = styled.div`
  width: 63vw;
  max-width: 450px;
  height: 65%;
  margin: 80px 0 40px;
  outline: 1px #3a4a58 solid;
  display: flex;
  border-radius: 5px;
  @media (max-width: 520px) {
    margin: 50px 0 40px;
  }
`;

export default function CountryAlbums({ signinRef }) {
  const myUserId = useSelector((state) => state.myUserId);
  const targetCountry = useSelector((state) => state.targetCountry);
  const [album, setAlbum] = useState([]);
  const history = useHistory();
  const messageRef = useRef();

  function handleToEdit() {
    if (!myUserId) {
      signinRef.current.style.zIndex = 3;
    } else {
      if (document.body.clientWidth > 880) {
        const newAlbumIdEditing = db_gallery.doc().id;

        async function albumPending() {
          await setAlbumDataIntoDb(newAlbumIdEditing, {
            id: newAlbumIdEditing,
            condition: "pending",
          });
          history.push({
            pathname: "edit",
            search: `album_id_edit=${newAlbumIdEditing}`,
          });
        }
        albumPending();
      } else {
        messageRef.current.style.display = "flex";
      }
    }
  }

  useEffect(() => {
    let unsubscribe = () => {};
    if (Object.keys(targetCountry).length) {
      unsubscribe = onSnapshotAlbumByCountry(targetCountry.id, setAlbum);
    }
    return () => unsubscribe();
  }, [targetCountry]);

  return (
    <>
      <Country>{targetCountry.name}</Country>
      <GalleryBackgroundDiv>
        {album.filter((album) => album.condition === "completed").length ? (
          <AlbumDiv>
            {album
              .filter((album) => album.condition === "completed")
              .sort((a, b) => b.timestamp.seconds - a.timestamp.seconds)
              .map((album) => {
                return <Album key={album.id} album={album} />;
              })}
            <AlbumHere>
              <AlbumAdd>
                <AddAlbumBtn onClick={handleToEdit} fontSize="28px" />
                <MediaMessage messageRef={messageRef} />
              </AlbumAdd>
            </AlbumHere>
          </AlbumDiv>
        ) : (
          <AddAlbumBtn onClick={handleToEdit} fontSize="36px" />
        )}
      </GalleryBackgroundDiv>
    </>
  );
}
