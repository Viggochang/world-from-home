import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";

import styled from "styled-components";

import MyTooltip from "../../../util/muiTooltips";

import countryTrans from "../../../util/countryTrans";

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
  @media (max-width: 800px) {
    margin: 15px 10px 0;
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
  :hover {
    box-shadow: 0px 0px 22px #d0d0d0;
  }
`;

export default function EditBtn({ albumIdShow, albumCountry, isMyAlbum }) {
  const dispatch = useDispatch();
  const history = useHistory();

  function handleEdit() {
    dispatch({
      type: "SET_ALBUM_ID_SHOW",
      payload: "",
    });
    dispatch({
      type: "SET_TARGET_COUNTRY",
      payload: {
        id: albumCountry,
        name: countryTrans[albumCountry].name_en,
      },
    });
    history.push({
      pathname: "edit",
      search: `?album_id_edit=${albumIdShow}`,
    });
  }

  return (
    <MyTooltip
      style={{ fontSize: 18, opacity: 0.9 }}
      title="Edit"
      placement="left"
      content={
        <ButtonStyle isMyAlbum={isMyAlbum.toString()} onClick={handleEdit}>
          <i className="fas fa-pencil-alt" />
        </ButtonStyle>
      }
    ></MyTooltip>
  );
}
