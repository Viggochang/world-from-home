import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import {
  getAlbumDataById,
  getUserDataByUid,
  onSnapshotAlbumByAlbumId,
} from "../../util/firebase";

import LikeBtn from "./albumBtns/LikeBtn";
import FriendBtn from "./albumBtns/FriendBtn";
import EditBtn from "./albumBtns/EditBtn";
import DeleteBtn from "./albumBtns/DeleteBtn";

import AlbumOwnerPhoto from "./albumInfo/AlbumOwnerPhoto";
import AlbumInformation from "./albumInfo/AlbumInformation";
import AlbumPraise from "./albumInfo/AlbumPraise";
import ShowAlbum from "./showAlbum/ShowAlbum";

const AlbumDiv = styled.div`
  width: calc(100vw - 200px);
  height: calc(100vh - 80px);
  background-color: rgb(0, 0, 0, 0.9);
  display: flex;
  z-index: ${(props) => (props.show ? 5 : -1)};
  opacity: ${(props) => (props.show ? 1 : 0)};
  position: fixed;
  top: 0;
  left: 0;
  flex-direction: column;
  padding: 40px 100px;
  overflow: scroll;
  @media (min-width: 1440px) {
    width: 1240px;
    padding: 40px calc(50vw - 620px);
  }
`;

const BackDiv = styled.div`
  position: fixed;
  top: 25px;
  right: 30px;
  color: #9d9d9d;
  font-weight: bold;
  font-size: 28px;
  cursor: pointer;
  z-index: 3;
  :hover {
    color: white;
  }
`;

const ButtonsDiv = styled.div`
  position: fixed;
  top: 150px;
  right: 100px;
  display: flex;
  flex-direction: column;
  z-index: 3;
  @media (max-width: 1440px) {
    right: 60px;
  }
  @media (max-width: 800px) {
    position: static;
    flex-direction: row;
  }
  @media (max-width: 750px) {
    margin-left: calc((33.33vw - 200px) / 2);
  }
`;

const AlbumInfoDiv = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: 750px) {
    margin-left: calc((33.33vw - 200px) / 2);
  }
`;

export default function Album() {
  const albumIdShow = useSelector((state) => state.albumIdShow);
  const myInfo = useSelector((state) => state.userInfo);
  const history = useHistory();
  const dispatch = useDispatch();
  const [albumData, setAlbumData] = useState({});
  const [ownerData, setOwnerData] = useState({});
  const [praise, setPraise] = useState(0);
  const [isMyAlbum, setIsMyAlbum] = useState(false);
  const albumRef = useRef();
  const loadingRef = useRef();

  const id = new URLSearchParams(window.location.search).get("album_id_show");

  async function getAlbumData(id) {
    const albumData = await getAlbumDataById(id);
    if (!albumData) {
      handleClickBack();
      history.push({ pathname: "notfound" });
    } else {
      setAlbumData(albumData);
      setIsMyAlbum(albumData.user_id === myInfo.id);

      const ownerData = await getUserDataByUid(albumData.user_id);
      setOwnerData(ownerData);
    }
  }

  useEffect(() => {
    id && getAlbumData(id);
  }, [id, myInfo]);

  useEffect(() => {
    let unsubscribe = () => {};
    if (albumIdShow) {
      unsubscribe = onSnapshotAlbumByAlbumId(albumIdShow, setPraise);
    }
    return () => {
      unsubscribe();
    };
  }, [albumIdShow]);

  function handleClickBack() {
    dispatch({ type: "SET_ALBUM_ID_SHOW", payload: "" });
    setOwnerData({});
    setAlbumData({});
    albumRef.current.style.opacity = 0;
    loadingRef.current.style.display = "block";

    let params = new URL(window.location).searchParams;
    params.delete("album_id_show");
    history.push({
      search: params.toString(),
    });
  }

  function handleEsc(event) {
    if (event.key === "Escape") {
      if (albumIdShow) {
        handleClickBack();
      }
    }
  }

  return (
    <AlbumDiv show={albumIdShow} onKeyDown={handleEsc} tabIndex="0">
      <BackDiv onClick={handleClickBack}>
        <i className="fas fa-times-circle" />
      </BackDiv>

      <AlbumInfoDiv>
        <AlbumOwnerPhoto ownerData={ownerData} />
        <AlbumInformation ownerData={ownerData} albumData={albumData} />
        <AlbumPraise praise={praise} />
      </AlbumInfoDiv>

      {myInfo.id && (
        <ButtonsDiv>
          <LikeBtn praise={albumData.praise} />
          <FriendBtn ownerData={ownerData} isMyAlbum={isMyAlbum} />
          <EditBtn
            albumIdShow={albumIdShow}
            albumCountry={albumData.country}
            isMyAlbum={isMyAlbum}
          />
          <DeleteBtn
            albumIdShow={albumIdShow}
            handleClickBack={handleClickBack}
            isMyAlbum={isMyAlbum}
          />
        </ButtonsDiv>
      )}

      <ShowAlbum
        albumContent={albumData.content}
        completeCanvas={albumData.completeCanvas}
        albumRef={albumRef}
        loadingRef={loadingRef}
      />
    </AlbumDiv>
  );
}
