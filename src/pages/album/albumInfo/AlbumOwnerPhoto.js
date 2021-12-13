import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import styled from "styled-components";

import { setAlbumIdShow } from "../../../util/redux/action";

const AlbumOwnerPhotoDiv = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 15px;
  cursor: pointer;
  background-image: url(${(props) => props.photo});
  background-size: cover;
  background-position: center;
  @media (max-width: 750px) {
    width: 50px;
    height: 50px;
  }
`;

export default function AlbumOwnerPhoto({ ownerData }) {
  const dispatch = useDispatch();
  const history = useHistory();
  return (
    <AlbumOwnerPhotoDiv
      photo={ownerData.photo}
      onClick={() => {
        dispatch(setAlbumIdShow(""));
        history.push({
          pathname: "user",
          search: `?id=${ownerData.id}`,
        });
      }}
    />
  );
}
