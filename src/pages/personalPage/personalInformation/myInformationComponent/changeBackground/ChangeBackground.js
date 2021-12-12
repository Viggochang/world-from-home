import React from "react";
import styled from "styled-components";
import { styled as styledMui } from "@mui/styles";

import { ChangeBackgroundBtn } from "../../../../../util/muiButton";
import { storage, updateUser } from "../../../../../util/firebase";
import Compressor from "compressorjs";

const EditBackgroundImage = styled.div`
  position: absolute;
  top: 0px;
  right: 90px;
  display: flex;
  border-radius: 20px;
  :hover {
    background-color: rgb(255, 255, 255, 0.2);
  }
  @media (max-width: 932px) {
    right: calc(50% - 187.5px);
  }
  @media (max-width: 450px) {
    right: calc(50% - 150px);
  }
`;

const Input = styledMui("input")({
  display: "none",
});

export default function ChangeBackground({ id }) {
  function handleUploadPhoto(event, key) {
    const img = event.target.files[0];

    new Compressor(img, {
      quality: 0.8,
      maxWidth: 4096,
      maxHeight: 4096,
      success(result) {
        const metadata = { contentType: result.type };
        const storageRef = storage.ref(`user_${key}/${id}`);
        storageRef.put(result, metadata).then(() => {
          storageRef.getDownloadURL().then((imageUrl) => {
            let photoObj = {};
            photoObj[key] = imageUrl;
            updateUser(id, photoObj);
          });
        });
      },
      error(err) {
        console.log(err.message);
      },
    });
  }
  return (
    <EditBackgroundImage>
      <label htmlFor="contained-button-file">
        <Input
          accept="image/*"
          id="contained-button-file"
          type="file"
          onChange={(e) => handleUploadPhoto(e, "background_photo")}
        />
        <ChangeBackgroundBtn />
      </label>
    </EditBackgroundImage>
  );
}
