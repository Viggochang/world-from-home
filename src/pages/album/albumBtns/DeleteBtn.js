import React from "react";

import styled from "styled-components";

import MyTooltip from "../../../util/muiTooltips";

import {
  getTouristSpotByAlbumId,
  updateTouristSpot,
  updateAlbum,
} from "../../../util/firebase";
import { swalDeleteAlbum } from "../../../util/swal";

const ButtonStyle = styled.div`
  margin-bottom: 30px;
  display: ${(props) => (props.isMyAlbum === "true" ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  font-size: 30px;
  color: #3a4a58;
  background-color: white;
  cursor: pointer;
  box-shadow: 0px 0px 10px #d0d0d0;
  @media (min-width: 1440px) {
    width: 80px;
    height: 80px;
    font-size: 36px;
  }
  :hover {
    box-shadow: 0px 0px 22px #d0d0d0;
  }
`;

export default function DeleteBtn({ albumIdShow, handleClickBack, isMyAlbum }) {
  function handleDelete() {
    async function discardTouristSpot() {
      const allSpots = await getTouristSpotByAlbumId(albumIdShow);
      allSpots.forEach((spot) =>
        updateTouristSpot(spot.id, { condition: "discard" })
      );
    }

    swalDeleteAlbum(
      () => {
        updateAlbum(albumIdShow, { condition: "discard" });
      },
      discardTouristSpot,
      handleClickBack
    );
  }

  return (
    <MyTooltip
      style={{ fontSize: 18, opacity: 0.9 }}
      title={"Delete"}
      placement="left"
      content={
        <ButtonStyle isMyAlbum={isMyAlbum.toString()} onClick={handleDelete}>
          <i className="fas fa-trash-alt" />
        </ButtonStyle>
      }
    ></MyTooltip>
  );
}
