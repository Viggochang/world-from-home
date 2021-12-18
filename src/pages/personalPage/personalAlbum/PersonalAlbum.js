import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { useShowAlbum } from "../../../util/customHook";

import styled from "styled-components";

import { onSnapshotAlbumByUserId } from "../../../util/firebase";
import AlbumFilter from "./AlbumFilter";
import AlbumSwitch from "./AlbumSwitch";
import AlbumInfo from "./AlbumInfo";

const MyGalleryContentDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-left: 50px;
  width: calc(100% - 320px);
  @media (max-width: 932px) {
    width: calc(100% - 60px);
    margin-left: 0;
  }
  @media (max-width: 640px) {
    width: 100%;
  }
`;

const ContentDiv = styled.div`
  padding: 10px 30px 30px;
  margin-top: 15px;
  width: calc(100% - 60px);
  max-height: calc(100vh - 170px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: rgb(255, 255, 255, 0.5);
  border-radius: 10px;
  @media (max-width: 932px) {
    flex-direction: column;
    align-items: center;
  }
  @media (max-width: 640px) {
    padding: 10px 10px 0;
    width: calc(100% - 20px);
  }
`;

const ContentDivInner = styled.div`
  margin-top: 10px;
  padding: 20px 40px 0 20px;
  overflow: scroll;
  display: flex;
  flex-direction: column;
  @media (max-width: 1180px) {
    width: calc(100% - 60px);
    align-items: center;
  }
  @media (max-width: 640px) {
    padding: 10px 10px 0 10px;
  }
`;

const AlbumDiv = styled.div`
  display: flex;
  margin-bottom: 30px;
  @media (max-width: 1180px) {
    width: 100%;
    max-width: 400px;
    flex-direction: column;
  }
`;
const AlbumCoverDiv = styled.div`
  width: 280px;
  height: 210px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  cursor: pointer;
  background-image: url(${(props) => props.photo});
  background-size: cover;
  background-position: center;
  @media (max-width: 1180px) {
    width: 100%;
    margin-top: 15px;
  }
`;

const AlbumInfoTop = styled.div`
  display: none;
  width: 100%;
  @media (max-width: 1180px) {
    display: block;
  }
`;

const AlbumInfoRight = styled.div`
  width: calc(100% - 310px);
  @media (max-width: 1180px) {
    display: none;
  }
`;

const NoAlbumsDiv = styled.div`
  font-size: 36px;
  font-weight: bold;
  margin: auto;
  padding-bottom: 30px;
  color: #3a4a58;
`;

export default function PersonalAlbum({ title, id, isMyPage }) {
  const [albumData, setAlbumData] = useState([]);
  const [albumDataFilter, setAlbumDataFilter] = useState([]);
  const [albumCountry, setAlbumCountry] = useState("All");
  const [albumOrder, setAlbumOrder] = useState("New");
  const [pending, setPending] = useState(false);
  const history = useHistory();

  const order = {
    New: (a, b) => b.timestamp.seconds - a.timestamp.seconds,
    Old: (a, b) => a.timestamp.seconds - b.timestamp.seconds,
    Popular: (a, b) => b.praise.length - a.praise.length,
    Unpopular: (a, b) => a.praise.length - b.praise.length,
  };

  useEffect(() => {
    setAlbumCountry("All");
    setAlbumOrder("New");
  }, [pending]);

  useEffect(() => {
    let unsubscribe = () => {};
    if (id) {
      unsubscribe = onSnapshotAlbumByUserId(id, setAlbumData);
    }
    return () => {
      unsubscribe();
    };
  }, [id]);

  useEffect(() => {
    setAlbumDataFilter(
      albumData
        .filter(
          ({ condition }) => condition === (pending ? "pending" : "completed")
        )
        .filter(
          ({ country }) => albumCountry === "All" || country === albumCountry
        )
        .sort(order[albumOrder])
    );
  }, [albumData, pending, albumCountry, albumOrder]);

  const handleShowAlbumId = useShowAlbum();

  return (
    <MyGalleryContentDiv>
      <AlbumFilter
        title={title}
        pending={pending}
        albumData={albumData}
        albumCountry={albumCountry}
        albumOrder={albumOrder}
        setAlbumCountry={setAlbumCountry}
        setAlbumOrder={setAlbumOrder}
      />
      <ContentDiv>
        <AlbumSwitch
          pending={pending}
          setPending={setPending}
          isMyPage={isMyPage}
        />

        <ContentDivInner>
          {albumDataFilter.length ? (
            albumDataFilter.map((album) => (
              <AlbumDiv key={album.id}>
                <AlbumInfoTop>
                  <AlbumInfo album={album} />
                </AlbumInfoTop>
                <AlbumCoverDiv
                  photo={album.cover_photo}
                  onClick={() => handleShowAlbumId("album_id_show", album.id)}
                ></AlbumCoverDiv>
                <AlbumInfoRight>
                  <AlbumInfo album={album} />
                </AlbumInfoRight>
              </AlbumDiv>
            ))
          ) : (
            <NoAlbumsDiv>No Albums！</NoAlbumsDiv>
          )}
        </ContentDivInner>
      </ContentDiv>
    </MyGalleryContentDiv>
  );
}
