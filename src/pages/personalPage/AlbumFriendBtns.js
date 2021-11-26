import React from "react";

import styled from "styled-components";
import Button from "@material-ui/core/Button";
import { ThemeProvider } from "@material-ui/core/styles";
import { albumFriendBtnTheme } from "../../util/muiTheme";

const AlbumFriendBtnsDiv = styled.div`
  display: flex;
  flex-direction: column;
  @media (max-width: 932px) {
    border-top: 1px white solid;
    padding: 20px 30px 0;
    width: calc(100% - 60px);
    flex-direction: row;
    justify-content: flex-start;
  }
  @media (max-width: 640px) {
    justify-content: center;
  }
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
    <ThemeProvider theme={albumFriendBtnTheme}>
      <AlbumFriendBtnsDiv>
        {["Albums", "Friends"].map((btn) => (
          <Button
            key={btn}
            variant="contained"
            sx={albumFriendButtonStyle(btn)}
            color={activeButton === btn ? "primary" : "secondary"}
            onClick={() => handleAlbumsFriend(btn)}
          >
            {btn}
          </Button>
        ))}
      </AlbumFriendBtnsDiv>
    </ThemeProvider>
  );
}
