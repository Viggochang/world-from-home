import React from "react";
import { useSelector, useDispatch } from "react-redux";

import styled from "styled-components";

import { setPageInfo, setEditUndo, setEditRedo } from "../../../redux/action";

const ToolContainerDiv = styled.div`
  width: 200px;
  height: calc(100vh - 220px);
  padding: 30px 24px 30px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgb(255, 255, 255, 0.9);
  position: fixed;
  top: 140px;
  left: 110px;
  z-index: 1;
  box-shadow: 0px 0px 10px #8e8e8e;
  border-radius: 7px;
  @media (max-width: 1200px) {
    flex-direction: row;
    width: calc(100% - 172px);
    padding: 15px 20px;
    height: 70px;
    top: 140px;
    left: 112px;
  }
  @media (max-width: 1000px) {
    width: calc(100% - 440px);
    left: 380px;
  }
`;

const ToolContainerDivInner = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: scroll;
  @media (max-width: 1200px) {
    flex-direction: row;
    padding: 5px 0;
  }
`;

const TemplateIcon = styled.img`
  width: 120px;
  margin: 20px 0;
  box-shadow: 0px 0px 10px #667484;
  cursor: pointer;
  @media (max-width: 1200px) {
    margin: 0px 20px;
    width: 80px;
  }
`;

export default function ToolContainer({
  templateActive,
  preview,
  setAddWindow,
}) {
  const dispatch = useDispatch();
  const pageInfo = useSelector((state) => state.pageInfo);
  const editUndo = useSelector((state) => state.editUndo);

  function handleMoreWindow(canvasCount, templateId) {
    if (preview === false) {
      let page = Object.keys(pageInfo).length
        ? Object.keys(pageInfo).length
        : 0;

      const pageInfoObj = {};
      pageInfoObj[`page${page}`] = {
        page,
        canvasCount,
        templateId,
        display: true,
      };

      dispatch(setPageInfo(pageInfoObj));
      dispatch(setEditUndo([...editUndo, `page${page}`]));
      dispatch(setEditRedo([]));
      setAddWindow(true);
    }
  }
  return (
    <ToolContainerDiv>
      <ToolContainerDivInner>
        {templateActive.map((template) => (
          <div
            onClick={() => handleMoreWindow(template[0], template[1])}
            key={template[1]}
          >
            <TemplateIcon alt={`template-${template[1]}`} src={template[2]} />
          </div>
        ))}
      </ToolContainerDivInner>
    </ToolContainerDiv>
  );
}
