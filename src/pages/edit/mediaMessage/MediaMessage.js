import React from "react";
import styled from "styled-components";

import { EditBtn } from "../../../util/muiButton";

const Mask = styled.div`
  display: none;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 6;
  background-color: rgb(0, 0, 0, 0.8);
`;

const MediaMessageDiv = styled.div`
  width: 80%;
  height: 30%;
  margin: auto;
  padding: 0 20px;
  background-color: #b8c3d0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
`;
const Message = styled.div`
  font-size: 28px;
  color: white;
  margin: 0 auto 20px;
`;

export default function MediaMessage({ messageRef }) {
  function handleClose() {
    messageRef.current.style.display = "none";
  }

  return (
    <Mask ref={messageRef}>
      <MediaMessageDiv>
        <Message>Please use laptop to edit your album!</Message>
        <EditBtn content="GOT IT !" onClick={handleClose}></EditBtn>
      </MediaMessageDiv>
    </Mask>
  );
}
