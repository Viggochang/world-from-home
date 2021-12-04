import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import { allTemplate } from "../../../util/myTemplate";

const ToolBarDiv = styled.div`
  width: 72px;
  height: calc(100vh - 160px);
  background-color: rgb(255, 255, 255, 0.9);
  position: fixed;
  top: 140px;
  left: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
  box-shadow: 0px 0px 10px #8e8e8e;
  border-radius: 7px;
  @media (max-width: 1000px) {
    flex-direction: row;
    width: fit-content;
    height: 78px;
    padding-left: 20px;
  }
`;

const IconHover = styled.div`
  width: 42px;
  height: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
`;

const ToolIconDiv = styled.div`
  width: 100%;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  &:hover ${IconHover} {
    background-color: rgb(184, 195, 208, 0.4);
  }
  @media (max-width: 1000px) {
    width: auto;
    margin: 2px 15px 0 0;
  }
`;

const IconDiv = styled.div`
  width: 24px;
  height: 24px;
  background-color: #b8c3d0;
  background-image: url(${(props) => props.photo});
  background-size: cover;
  background-position: center;
`;

const ToolNameDiv = styled.div`
  text-align: center;
  line-height: 18px;
  color: #667484;
  font-size: 12px;
  margin-top: -2px;
`;

export default function ToolBar({ setTemplateActive }) {
  const toolIconRef = useRef([]);
  useEffect(() => {
    handleHoverToolIcon(0);
  }, []);

  function handleClickTool(key) {
    setTemplateActive(allTemplate[key].template);
  }
  function handleHoverToolIcon(index) {
    toolIconRef.current.forEach(
      (el) => (el.style.backgroundColor = "rgb(0,0,0,0)")
    );
    toolIconRef.current[index].style.backgroundColor =
      "rgb(184, 195, 208, 0.4)";
  }

  return (
    <ToolBarDiv>
      {Object.keys(allTemplate).map((tool, index) => (
        <ToolIconDiv
          key={tool}
          onClick={() => {
            handleClickTool(tool);
            handleHoverToolIcon(index);
          }}
        >
          <IconHover ref={(el) => (toolIconRef.current[index] = el)}>
            <IconDiv photo={allTemplate[tool].icon} />
          </IconHover>
          <ToolNameDiv>{allTemplate[tool].name}</ToolNameDiv>
        </ToolIconDiv>
      ))}
    </ToolBarDiv>
  );
}
