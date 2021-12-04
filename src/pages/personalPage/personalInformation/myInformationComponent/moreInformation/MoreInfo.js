import React, { useRef } from "react";
import { useSelector } from "react-redux";

import styled from "styled-components";
import "./input.css";

import { updateUser } from "../../../../../util/firebase";
import Email from "./Email";
import Language from "./Language";
import Birthday from "./Birthday";
import Introduction from "./Introduction";

const MoreInfoDiv = styled.div`
  width: 320px;
  height: auto;
  background-color: rgb(255, 255, 255, 0.7);
  box-shadow: 3px 2px 15px #5b5b5b;
  z-index: 2;
  display: none;
  position: absolute;
  top: 0;
  right: 80px;
  padding: 30px 30px 0;
  flex-direction: column;
  align-items: flex-start;
  font-weight: 400;
  border-radius: 10px;
`;

const CloseDiv = styled.div`
  color: #9d9d9d;
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 26px;
  cursor: pointer;
  :hover {
    color: #3a4a58;
  }
`;

export default function MoreInfo({ innerRef, handleMoreInfo, userInfo }) {
  const myInfo = useSelector((state) => state.userInfo);
  const editRef = useRef({});
  const infoRef = useRef({});

  function handleCloseMoreInfo() {
    innerRef.current.style.display = "none";
  }

  async function handleUpdateData(body, info_ref, edit_ref) {
    await updateUser(myInfo.id, body);
    handleShow(info_ref);
    handleDisappear(edit_ref);
  }

  function handleShow(el) {
    el.style.display = "flex";
  }
  function handleDisappear(el) {
    el.style.display = "none";
  }

  const allInfo = ["language", "birthday", "introduction"];
  return (
    <MoreInfoDiv ref={innerRef}>
      <CloseDiv
        onClick={() => {
          handleCloseMoreInfo();
          handleMoreInfo();
          allInfo.forEach((data) => {
            handleDisappear(editRef.current[data]);
            handleShow(infoRef.current[data]);
          });
        }}
      >
        <i className="fas fa-times-circle" />
      </CloseDiv>

      <Email email={userInfo.email} />
      <Language
        handleShow={handleShow}
        handleDisappear={handleDisappear}
        handleUpdateData={handleUpdateData}
        editRef={editRef}
        infoRef={infoRef}
      />
      <Birthday
        handleShow={handleShow}
        handleDisappear={handleDisappear}
        handleUpdateData={handleUpdateData}
        editRef={editRef}
        infoRef={infoRef}
      />
      <Introduction
        handleShow={handleShow}
        handleDisappear={handleDisappear}
        handleUpdateData={handleUpdateData}
        editRef={editRef}
        infoRef={infoRef}
      />
    </MoreInfoDiv>
  );
}
