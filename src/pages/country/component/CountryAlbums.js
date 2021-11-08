import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { db_gallery } from "../../../util/firebase";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { styled as styledMui } from "@mui/styles";
import { autocompleteClasses } from "@material-ui/core";

import { db_userInfo } from "../../../util/firebase";
import Album from "./CountryAlbum_album";

const theme = createTheme({
  status: {
    danger: "#e53e3e",
  },
  palette: {
    primary: {
      main: "#3A4A58",
      darker: "#053e85",
    },
    neutral: {
      main: "#64748B",
      contrastText: "#fff",
    },
    white: {
      main: "#ffffff",
    },
  },
});

const GalleryBackgroundDiv = styled.div`
  width: calc(65% - 80px);
  margin-left: 20px;
  /* height: calc(57% - 40px); */
  height: calc(57% - 20px);
  background-color: #e0e0e0;
  padding: 20px;
  display: flex;
`;

const AlbumDiv = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  overflow: scroll;
`;

const AlbumHere = styled.div`
  width: 50%;
  width: 500px;
  margin: 0 10px;
  color: #3a4a58;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
`;

const AlbumAdd = styled.div`
  width: 500px;
  height: 65%;
  margin: 80px 0 40px;
  outline: 1px #3a4a58 solid;
  display: flex;
`;

export default function CountryAlbums({ galleryQuestionRef }) {
  const targetCountry = useSelector((state) => state.targetCountry);
  const [album, setAlbum] = useState([]);
  const history = useHistory();

  // function handleGalleryQuestion() {
  //   galleryQuestionRef.current.style.display = "flex";
  // }

  function handleToEdit() {
    history.push({ pathname: "edit" });
    // window.location = '/edit'
  }

  useEffect(() => {
    console.log(targetCountry);
    if (Object.keys(targetCountry).length) {
      let unsubscribe = db_gallery
        .where("country", "==", targetCountry.id)
        .onSnapshot((querySnapshot) => {
          let albums = [];
          querySnapshot.forEach((album) => albums.push(album.data()));
          setAlbum(albums);
        });
      return () => {
        unsubscribe();
      };
    }
  }, [targetCountry]);

  return (
    <GalleryBackgroundDiv>
      {album.filter((album) => album.condition === "completed").length ? (
        <AlbumDiv>
          {album
            .filter((album) => album.condition === "completed")
            .map((album) => {
              //getOwnerPhoto(album.user_id);
              return <Album key={album.id} album={album} />;
            })}
          <AlbumHere>
            <AlbumAdd>
              <ThemeProvider theme={theme}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleToEdit}
                  style={{ margin: "auto", lineHeight: 1.5, fontSize: "28px" }}
                >
                  +&emsp; add my&emsp; <b>{targetCountry.name}</b>
                </Button>
              </ThemeProvider>
            </AlbumAdd>
          </AlbumHere>
        </AlbumDiv>
      ) : (
        <ThemeProvider theme={theme}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleToEdit}
            style={{ margin: "auto", lineHeight: 1.5, fontSize: "36px" }}
          >
            +&emsp; add my&emsp; <b>{targetCountry.name}</b>
          </Button>
        </ThemeProvider>
      )}
    </GalleryBackgroundDiv>
  );
}
