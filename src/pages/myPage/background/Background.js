import React from "react";
import styled from "styled-components";

const defaultBackground =
  "https://firebasestorage.googleapis.com/v0/b/world-from-home.appspot.com/o/user_background_photo%2Fdefault-background.jpg?alt=media&token=17d3a90e-1f80-45c2-9b1d-e641d7ee0b88";

const BackgroundDiv = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
`;

const Mask = styled.div`
  width: 100vw;
  height: 100vh;
  background: rgb(142, 142, 142, 0.6);
`;

export default function Background({ background_photo }) {
  return (
    <BackgroundDiv
      style={{
        backgroundImage: background_photo
          ? `url(${background_photo})`
          : `url(${defaultBackground})`,
        backgroundSize: "cover",
      }}
    >
      <Mask />
    </BackgroundDiv>
  );
}
