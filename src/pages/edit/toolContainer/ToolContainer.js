import React from "react";
import { useSelector, useDispatch } from "react-redux";

import styled from "styled-components";

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
`;

const ToolContainerDivInner = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: scroll;
`;

const TemplateIcon = styled.img`
  width: 120px;
  margin: 20px 0;
  box-shadow: 0px 0px 10px #667484;
  cursor: pointer;
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

      dispatch({
        type: "SET_PAGE_INFO",
        payload: pageInfoObj,
      });
      dispatch({
        type: "UNDO",
        payload: [...editUndo, `page${page}`],
      });
      dispatch({
        type: "REDO",
        payload: [],
      });
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
