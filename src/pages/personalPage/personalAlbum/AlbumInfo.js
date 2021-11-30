import React from "react";
import styled from "styled-components";

import countryTrans from "../../../util/countryTrans";

const AlbumInfoDiv = styled.div`
  margin-left: 30px;
  display: flex;
  flex-direction: column;
  color: #3a4a58;
  width: 100%;
  height: 210px;
  position: relative;
  @media (max-width: 1180px) {
    margin-left: 0;
    height: auto;
  }
`;

const AlbumCountry = styled.div`
  font-size: 48px;
  font-weight: bold;
  @media (max-width: 1400px) {
    font-size: 30px;
  }
`;

const AlbumPosition = styled.div`
  font-size: 30px;
  line-height: 48px;
  @media (max-width: 1400px) {
    font-size: 20px;
    line-height: 36px;
  }
`;

const AlbumIntroduction = styled.div`
  margin-top: 10px;
  overflow: scroll;
  height: calc(100% - 103px);
  @media (max-width: 1400px) {
    font-size: 14px;
  }
  @media (max-width: 1180px) {
    height: auto;
    margin-top: 5px;
  }
`;

const AlbumDate = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  @media (max-width: 1400px) {
    font-size: 14px;
  }
  @media (max-width: 1260px) {
    display: none;
  }
`;

const AlbumPraise = styled.div`
  position: absolute;
  top: 80px;
  right: 0;
  @media (max-width: 1400px) {
    top: 45px;
  }
`;

export default function AlbumInfo({ album }) {
  return (
    <AlbumInfoDiv>
      <AlbumCountry>{countryTrans[album.country].name_en}</AlbumCountry>
      <AlbumPosition>
        <i className="fas fa-map-marker-alt" /> {album.position}
      </AlbumPosition>
      <AlbumIntroduction>{album.introduction}</AlbumIntroduction>
      <AlbumDate>
        <i className="far fa-calendar-alt" />
        &ensp;
        {new Date(album.timestamp.seconds * 1000).toDateString()}
      </AlbumDate>
      <AlbumPraise>
        <i className="fas fa-thumbs-up" /> {album.praise.length}
      </AlbumPraise>
    </AlbumInfoDiv>
  );
}
