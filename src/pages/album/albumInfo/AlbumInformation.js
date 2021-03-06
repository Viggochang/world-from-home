import React from "react";
import styled from "styled-components";

const AlbumInformationDiv = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
`;

const AlbumOwnerName = styled.div`
  margin-left: 5px;
  font-weight: bold;
  font-size: 30px;
  line-height: 40px;
  @media (max-width: 750px) {
    font-size: 20px;
    line-height: 27px;
  }
`;

const AlbumDate = styled.div`
  margin-left: 5px;
  font-size: 22px;
  line-height: 40px;
  @media (max-width: 750px) {
    font-size: 14px;
    line-height: 27px;
  }
`;

export default function AlbumInformation({ ownerData, albumData }) {
  return (
    <AlbumInformationDiv>
      <AlbumOwnerName>{ownerData.name}</AlbumOwnerName>
      <AlbumDate>
        <i className="far fa-calendar-alt" />
        &ensp;
        {albumData.timestamp
          ? new Date(albumData.timestamp.seconds * 1000).toDateString()
          : ""}
      </AlbumDate>
    </AlbumInformationDiv>
  );
}
