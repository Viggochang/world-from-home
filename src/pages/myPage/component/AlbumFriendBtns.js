import React from "react";

import styled from "styled-components";
import Button from "@material-ui/core/Button";
import { ThemeProvider } from "@material-ui/core/styles";
import { albumFriendBtnTheme as theme } from "../../../util/muiTheme";

const AlbumFriendBtnsDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function AlbumFriendBtns({ activeButton, setActiveButton }) {
  function handleAlbumsFriend(btn) {
    setActiveButton(btn);
  }

  const albumFriendButtonStyle = () => ({
    width: "190px",
    margin: "4px 0 24px",
    border: `2px #ffffff solid`,
    color: "#ffffff",
    boxShadow: "4px 6px 10px rgb(50, 50, 50, 0.7)",
    ":hover": {
      boxShadow: "4px 6px 5px rgb(50, 50, 50, 0.7)",
    },
  });

  return (
    <AlbumFriendBtnsDiv>
      <ThemeProvider theme={theme}>
        {["Albums", "Friends"].map((btn) => (
          <Button
            variant="contained"
            sx={albumFriendButtonStyle(btn)}
            color={activeButton === btn ? "primary" : "secondary"}
            onClick={() => handleAlbumsFriend(btn)}
          >
            {btn}
          </Button>
        ))}
      </ThemeProvider>
    </AlbumFriendBtnsDiv>
  );
}
