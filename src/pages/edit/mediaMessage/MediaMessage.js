import React from "react";
import styled from "styled-components";

import { EditBtn } from "../../../util/muiButton";
import laptop from "../../../image/gif/laptop.gif";

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
  width: 550px;
  height: 35%;
  margin: auto;
  padding: 20px;
  background-color: #b8c3d0;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  border-radius: 8px;
  box-shadow: 0px 0px 5px 1px #d0d0d0;
  @media (max-width: 640px) {
    width: 330px;
  }
`;
const Message = styled.div`
  font-size: 32px;
  color: #3a4a58;
  margin: 0 auto;
  font-weight: bold;
  text-align: center;
  top: 35px;
  @media (max-width: 640px) {
    font-size: 28px;
  }
`;

const LaptopGif = styled.img`
  height: 60%;
  @media (max-width: 640px) {
    height: 60%;
  }
`;

export default function MediaMessage({ messageRef }) {
  function handleClose() {
    messageRef.current.style.display = "none";
  }

  return (
    <Mask ref={messageRef}>
      <MediaMessageDiv>
        <Message>Please edit your album on laptop!</Message>
        <LaptopGif src={laptop} alt="laptop" />
        <EditBtn content="GOT IT !" onClick={handleClose}></EditBtn>
      </MediaMessageDiv>
    </Mask>
  );
}
