import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { db_gallery } from "../../../util/firebase";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { styled as styledMui } from "@mui/styles";

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
`;

const AlbumPosition = styled.div`
  margin-left: 5px;
  font-weight: bold;
  font-size: 30px;
  line-height: 40px;
`;
const AlbumDate = styled.div`
  margin-left: 5px;
  font-size: 20px;
  line-height: 30px;
`;
const AlbumPhoto = styled.div`
  width: 500px;
  height: 65%;
  cursor: pointer;
  margin-top: 10px;
`;
const AlbumPraise = styled.div`
  margin: 10px 5px 0 auto;
  font-size: 20px;
  line-height: 30px;
`;
const AlbumAdd = styled.div`
  width: 500px;
  height: 65%;
  margin: 80px 0 40px;
  outline: 1px #3a4a58 solid;
  display: flex;
`;

const AddBtn = styledMui(Button)({
  lineHeight: 1.5,
  fontSize: "36px",
  margin: "auto",
});

export default function GalleryInCountry({ galleryQuestionRef }) {
  const targetCountry = useSelector((state) => state.targetCountry);
  const [album, setAlbum] = useState([]);

  function handleGalleryQuestion() {
    galleryQuestionRef.current.style.display = "flex";
  }

  useEffect(() => {
    console.log(targetCountry);
    if (Object.keys(targetCountry).length) {
      db_gallery
        .where("country", "==", targetCountry.id)
        .get()
        .then((querySnapshot) => {
          let albums = [];
          querySnapshot.forEach((album) => albums.push(album.data()));
          console.log(albums);
          setAlbum(albums);
          console.log(albums);
        });
    }
  }, [targetCountry]);

  return (
    <GalleryBackgroundDiv>
      {album.length ? (
        <AlbumDiv>
          {album.map((album) => (
            <AlbumHere key={album.id}>
              <AlbumPosition>
                <i className="fas fa-map-pin" />
                &ensp;{album.position}
              </AlbumPosition>
              <AlbumDate>
                <i className="far fa-calendar-alt" />
                &ensp;{new Date(album.timestamp.seconds * 1000).toDateString()}
              </AlbumDate>
              <AlbumPhoto
                style={{
                  backgroundImage: `url(${album.cover_photo})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                // to-do
                // onClick={() => {
                //   history.push({ pathname: "user", search: `?id=${friend.id}` });
                // }}
              />
              <AlbumPraise>
                <i className="fas fa-heart"></i> {album.praise.length}
              </AlbumPraise>
            </AlbumHere>
          ))}
          <AlbumHere>
            <AlbumAdd>
              <ThemeProvider theme={theme}>
                <AddBtn
                  variant="outlined"
                  color="primary"
                  onClick={handleGalleryQuestion}
                >
                  +&emsp; add my&emsp; <b>{targetCountry.name}</b>
                </AddBtn>
              </ThemeProvider>
            </AlbumAdd>
          </AlbumHere>
        </AlbumDiv>
      ) : (
        <ThemeProvider theme={theme}>
          <AddBtn
            variant="outlined"
            color="primary"
            onClick={handleGalleryQuestion}
          >
            +&emsp; add my&emsp; <b>{targetCountry.name}</b>
          </AddBtn>
        </ThemeProvider>
      )}
    </GalleryBackgroundDiv>
  );
}
