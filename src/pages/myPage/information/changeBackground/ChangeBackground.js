import React from "react";
import styled from "styled-components";
import { ThemeProvider } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { styled as styledMui } from "@mui/styles";

import { storage, updateUser } from "../../../../util/firebase";
import Compressor from "compressorjs";
import { changeBackgroundBtnTheme } from "../../../../util/muiTheme";

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

const CameraIcon = styled.div`
  font-size: 18px;
  margin-right: 10px;
`;

export default function ChangeBackground({ id }) {
  function handleUploadPhoto(event, key) {
    const img = event.target.files[0];

    new Compressor(img, {
      quality: 0.8,
      maxWidth: 4096,
      maxHeight: 4096,
      success(result) {
        // Send the compressed image file to server with XMLHttpRequest.
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
      <ThemeProvider theme={changeBackgroundBtnTheme}>
        <label htmlFor="contained-button-file">
          <Input
            accept="image/*"
            id="contained-button-file"
            type="file"
            onChange={(e) => handleUploadPhoto(e, "background_photo")}
          />
          <Button
            variant="outlined"
            component="span"
            sx={{
              outline: `1px #ffffff solid`,
              color: "#ffffff",
              textAlign: "left",
              padding: "5px 15px",
            }}
            color="primary"
          >
            <CameraIcon>
              <i className="fas fa-camera" />
            </CameraIcon>
            <div>
              change
              <br />
              background
            </div>
          </Button>
        </label>
      </ThemeProvider>
    </EditBackgroundImage>
  );
}
