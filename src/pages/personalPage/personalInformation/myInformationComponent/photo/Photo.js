import React, { useRef } from "react";
import Compressor from "compressorjs";
import { storage, updateUser } from "../../../../../util/firebase";

import styled from "styled-components";
import { styled as styledMui } from "@mui/styles";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { ThemeProvider } from "@material-ui/core/styles";
import { whiteBtnTheme } from "../../../../../util/muiTheme";

const MyPhoto = styled.div`
  width: 350px;
  height: 350px;
  box-shadow: 2px 2px 20px #3c3c3c;
  position: relative;
  color: white;
  border-radius: 20px;
  background-image: url(${(props) => props.photo});
  background-size: cover;
  background-position: center;
  @media (max-width: 1180px) {
    width: 250px;
    height: 250px;
  }
  @media (max-width: 932px) {
    margin-top: 60px;
    width: 375px;
    height: 375px;
  }
  @media (max-width: 450px) {
    width: 300px;
    height: 300px;
  }
`;

const EditMyPhoto = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 50px;
  background-color: rgb(0, 0, 0, 0.7);
  border-end-end-radius: 20px;
  border-end-start-radius: 20px;
  display: none;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
`;

const Input = styledMui("input")({
  display: "none",
});

export default function Photo({ id, photo }) {
  const editMyPhotoRef = useRef();

  function handleShow(ref) {
    ref.current.style.display = "flex";
  }
  function handleDisappear(ref) {
    ref.current.style.display = "none";
  }

  function handleUploadPhoto(event, key) {
    const img = event.target.files[0];

    new Compressor(img, {
      quality: 0.6,
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
    <MyPhoto
      photo={photo}
      onMouseEnter={() => handleShow(editMyPhotoRef)}
      onMouseLeave={() => handleDisappear(editMyPhotoRef)}
    >
      <label htmlFor="my-photo">
        <EditMyPhoto ref={editMyPhotoRef}>
          <Input
            accept="image/*"
            id="my-photo"
            type="file"
            onChange={(e) => handleUploadPhoto(e, "photo")}
          />
          <ThemeProvider theme={whiteBtnTheme}>
            <IconButton
              color="white"
              aria-label="upload picture"
              component="span"
              size="large"
            >
              <PhotoCamera />
            </IconButton>
          </ThemeProvider>
        </EditMyPhoto>
      </label>
    </MyPhoto>
  );
}
