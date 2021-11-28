import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import styled from "styled-components";

const AlbumOwnerPhotoDiv = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 15px;
  cursor: pointer;
  background-image: url(${(props) => props.photo});
  background-size: cover;
  background-position: center;
`;

export default function AlbumOwnerPhoto({ ownerData }) {
  const dispatch = useDispatch();
  const history = useHistory();
  return (
    <AlbumOwnerPhotoDiv
      photo={ownerData.photo}
      onClick={() => {
        dispatch({
          type: "SET_ALBUM_ID_SHOW",
          payload: "",
        });
        history.push({
          pathname: "user",
          search: `?id=${ownerData.id}`,
        });
      }}
    />
  );
}
