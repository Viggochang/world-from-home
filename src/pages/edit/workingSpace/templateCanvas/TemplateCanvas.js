import React from "react";
import styled from "styled-components";

import UploadImage from "./uploadImage/UploadImage";
import AddText from "./AddText";

const MyCanvas = styled.canvas``;

const CanvasContainer = styled.div`
  box-shadow: 0px 0px 2px #8e8e8e;
`;

export default function TemplateCanvas({
  slideShow,
  canvasCount,
  canvasDivRef,
  page,
  preview,
  addTextRef,
  uploadImageRef,
  handleCanvasOn,
}) {
  function handleShowIcon(e, canvasId) {
    if (!preview) {
      addTextRef.current[canvasId].style.zIndex = 1;
      uploadImageRef.current[canvasId].style.zIndex = 1;
    }
  }

  function handleDisplayIcon(e, canvasId) {
    if (!preview) {
      addTextRef.current[canvasId].style.zIndex = -1;
      uploadImageRef.current[canvasId].style.zIndex = -1;
    }
  }
  return (
    <>
      {Array.from(new Array(canvasCount).keys()).map((id, index) => {
        return (
          <CanvasContainer
            ref={(el) => (canvasDivRef.current[`page${page}-canvas${id}`] = el)}
            style={{
              position: slideShow ? "absolute" : "relative",
              transition: "opacity 1s",
            }}
            key={`page${page}-canvas${id}`}
            tabIndex="0"
            onFocus={(e) => {
              if (!preview) {
                e.target.style.boxShadow = "0px 0px 5px #6c6c6c";
                e.target.style.zIndex = 2;
              }
            }}
            onBlur={(e) => {
              if (!preview) {
                e.target.style.boxShadow = "0px 0px 2px #8e8e8e";
              }
            }}
            onClick={(e) => {}}
            onMouseEnter={(e) => handleShowIcon(e, `page${page}-canvas${id}`)}
            onMouseLeave={(e) =>
              handleDisplayIcon(e, `page${page}-canvas${id}`)
            }
          >
            <AddText
              page={page}
              id={id}
              addTextRef={addTextRef}
              handleCanvasOn={handleCanvasOn}
            />
            <UploadImage
              page={page}
              id={id}
              uploadImageRef={uploadImageRef}
              handleCanvasOn={handleCanvasOn}
            />
            <MyCanvas id={`page${page}-canvas${id}`} />
          </CanvasContainer>
        );
      })}
    </>
  );
}
