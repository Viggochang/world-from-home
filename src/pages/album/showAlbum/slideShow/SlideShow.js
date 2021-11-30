import React, { useEffect, useState } from "react";
import styled from "styled-components";

const CanvasContainer = styled.div`
  position: absolute;
  transition: opacity 1s;
`;

const MyCanvas = styled.canvas``;

const ButtonDiv = styled.div`
  width: 100%;
  margin: auto 0;
  display: flex;
  justify-content: space-between;
  z-index: 2;
`;

const BtnStyle = styled.div`
  width: 31px;
  height: 36px;
  border-radius: 50%;
  color: rgb(58, 74, 88, 0.6);
  font-size: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: rgb(255, 255, 255, 0.3);
  :hover {
    color: rgb(58, 74, 88, 0.8);
    background-color: rgb(255, 255, 255, 0.7);
  }
`;

const LeftBtn = styled(BtnStyle)`
  margin-left: 10px;
  padding-right: 5px;
`;

const RightBtn = styled(BtnStyle)`
  margin-right: 10px;
  padding-left: 5px;
`;

export default function SlideShow({
  canvasDivRef,
  allCanvasRef,
  page,
  canvasCount,
}) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    Object.entries(canvasDivRef.current)
      .filter((canvas) => canvas[0].includes(`preview-page${page}`))
      .forEach((canvas) => {
        canvas[1].style.zIndex = 0;
        canvas[1].style.opacity = 0;
      });
    canvasDivRef.current[
      `preview-page${page}-canvas${activeSlide}`
    ].style.zIndex = 1;
    canvasDivRef.current[
      `preview-page${page}-canvas${activeSlide}`
    ].style.opacity = 1;
  }, [activeSlide]);

  useEffect(() => {
    let changeSlide = setTimeout(() => {
      setActiveSlide((activeSlide) => (activeSlide + 1) % 3);
    }, 3000);
    return () => {
      clearTimeout(changeSlide);
    };
  }, [activeSlide]);

  function handleLeft() {
    setActiveSlide((activeSlide) => (activeSlide + 2) % 3);
  }
  function handleRight() {
    setActiveSlide((activeSlide) => (activeSlide + 1) % 3);
  }

  return (
    <>
      {Array.from(new Array(canvasCount).keys()).map((id) => {
        return (
          <CanvasContainer
            ref={(el) =>
              (canvasDivRef.current[`preview-page${page}-canvas${id}`] = el)
            }
            key={`preview-page${page}-canvas${id}`}
            tabIndex="0"
          >
            <MyCanvas
              id={`preview-page${page}-canvas${id}`}
              ref={(el) =>
                (allCanvasRef.current[`preview-page${page}-canvas${id}`] = el)
              }
            />
          </CanvasContainer>
        );
      })}
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
