import React, { useRef } from "react";
import Compressor from "compressorjs";
import { storage, db_userInfo } from "../../../../util/firebase";

import styled from "styled-components";
import { styled as styledMui } from "@mui/styles";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
const theme = createTheme({
  status: {
    danger: "#e53e3e",
  },
  palette: {
    primary: {
      main: "#3A4A58",
      darker: "#053e85",
      font: "#ffffff",
    },
    neutral: {
      main: "#64748B",
      contrastText: "#fff",
    },
    white: {
      main: "#ffffff",
      font: "#3A4A58",
    },
  },
});

const MyPhoto = styled.div`
  width: 450px;
  height: 450px;
  box-shadow: 2px 2px 20px #3c3c3c;
  position: relative;
  color: white;
  border-radius: 20px;
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
        // Send the compressed image file to server with XMLHttpRequest.
        const metadata = { contentType: result.type };
        const storageRef = storage.ref(`user_${key}/${id}`);
        storageRef.put(result, metadata).then(() => {
          storageRef.getDownloadURL().then((imageUrl) => {
            console.log(imageUrl);
            let photoObj = {};
            photoObj[key] = imageUrl;
            db_userInfo.doc(id).update(photoObj);
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
      style={{
        backgroundImage: `url(${photo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
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
          <ThemeProvider theme={theme}>
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
