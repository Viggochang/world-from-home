import React, { useEffect, useState } from "react";
import styled from "styled-components";

import TemplateCanvas from "../templateCanvas/TemplateCanvas";
import "./slideShow.css";

const ButtonDiv = styled.div`
  width: 100%;
  margin: auto 0;
  display: flex;
  justify-content: space-between;
  z-index: 2;
`;
const LeftBtn = styled.div`
  width: 31px;
  height: 36px;
  border-radius: 50%;
  color: rgb(58, 74, 88, 0.6);
  font-size: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-left: 10px;
  padding-right: 5px;
  background-color: rgb(255, 255, 255, 0.3);
  :hover {
    color: rgb(58, 74, 88, 0.8);
    background-color: rgb(255, 255, 255, 0.7);
  }
`;

const RightBtn = styled.div`
  width: 31px;
  height: 36px;
  border-radius: 50%;
  color: rgb(58, 74, 88, 0.6);
  font-size: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-right: 10px;
  padding-left: 5px;
  background-color: rgb(255, 255, 255, 0.3);
  :hover {
    color: rgb(58, 74, 88, 0.8);
    background-color: rgb(255, 255, 255, 0.7);
  }
`;

export default function SlideShow({
  canvasCount,
  canvasDivRef,
  page,
  preview,
  addTextRef,
  uploadImageRef,
  handleCanvasOn,
  allCanvasRef,
}) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    Object.entries(canvasDivRef.current)
      .filter((canvas) => canvas[0].includes(`page${page}`))
      .forEach((canvas) => (canvas[1].style.zIndex = 0));
    Object.entries(canvasDivRef.current)
      .filter((canvas) => canvas[0].includes(`page${page}`))
      .forEach((canvas) => (canvas[1].style.opacity = 0));
    canvasDivRef.current[`page${page}-canvas${activeSlide}`].style.zIndex = 1;
    canvasDivRef.current[`page${page}-canvas${activeSlide}`].style.opacity = 1;
  }, [activeSlide]);

  function handleLeft() {
    setActiveSlide((activeSlide) => (activeSlide + 2) % 3);
  }
  function handleRight() {
    setActiveSlide((activeSlide) => (activeSlide + 1) % 3);
  }

  return (
    <>
      <TemplateCanvas
        slideShow={true}
        canvasCount={canvasCount}
        canvasDivRef={canvasDivRef}
        page={page}
        preview={preview}
        addTextRef={addTextRef}
        uploadImageRef={uploadImageRef}
        handleCanvasOn={handleCanvasOn}
        allCanvasRef={allCanvasRef}
      />
      <ButtonDiv>
        <LeftBtn onClick={handleLeft}>
          <i className="fas fa-caret-left" />
        </LeftBtn>
        <RightBtn onClick={handleRight}>
          <i className="fas fa-caret-right" />
        </RightBtn>
      </ButtonDiv>
    </>
  );
}
