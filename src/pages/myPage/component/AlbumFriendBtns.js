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
    width: "180px",
    margin: "4px 0 24px",
    outline: `3px #ffffff solid`,
    color: "#ffffff",
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
