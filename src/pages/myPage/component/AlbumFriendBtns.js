import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

import styled from "styled-components";
import Button from "@material-ui/core/Button";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import TextField from "@mui/material/TextField";

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

const AlbumFriendBtnsDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function AlbumFriendBtns({ activeButton, setActiveButton }) {
  // const [activeButton, setActiveButton] = useState("Albums");

  function handleAlbums() {
    setActiveButton("Albums");
  }

  function handleFriends() {
    setActiveButton("Friends");
  }

  return (
    <AlbumFriendBtnsDiv>
      <ThemeProvider theme={theme}>
        <Button
          variant="contained"
          color={activeButton === "Albums" ? "primary" : "white"}
          style={{
            width: "180px",
            fontSize: "20px",
            borderRadius: "40px",
            lineHeight: 1.5,
            fontWeight: "bold",
            color: activeButton === "Albums" ? "white" : "#3A4A58",
            outline:
              activeButton === "Albums"
                ? "3px white solid"
                : "3px #3A4A58 solid",
          }}
          onClick={handleAlbums}
        >
          Albums
        </Button>
        <Button
          variant="contained"
          color={activeButton === "Friends" ? "primary" : "white"}
          style={{
            width: "180px",
            fontSize: "20px",
            borderRadius: "40px",
            lineHeight: 1.5,
            fontWeight: "bold",
            marginTop: "20px",
            color: activeButton === "Friends" ? "white" : "#3A4A58",
            outline:
              activeButton === "Albums"
                ? "3px #3A4A58 solid"
                : "3px white solid",
          }}
          onClick={handleFriends}
        >
          Friends
        </Button>
      </ThemeProvider>
    </AlbumFriendBtnsDiv>
  );
}
