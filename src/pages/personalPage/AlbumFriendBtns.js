import React from "react";

import styled from "styled-components";
import { AlbumFriendBtn } from "../../util/muiButton";

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
  return (
    <AlbumFriendBtnsDiv>
      {["Albums", "Friends"].map((btn) => (
        <AlbumFriendBtn
          key={btn}
          content={btn}
          activeButton={activeButton}
          onClick={() => setActiveButton(btn)}
        />
      ))}
    </AlbumFriendBtnsDiv>
  );
}
