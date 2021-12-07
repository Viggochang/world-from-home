import React, { useRef } from "react";
import styled from "styled-components";

import UploadImage from "./uploadImage/UploadImage";
import AddText from "./AddText";

import loadingUpload from "../../../../image/loading/loading_upload_photo.gif";

const MyCanvas = styled.canvas``;

const CanvasContainer = styled.div`
  box-shadow: 0px 0px 2px #8e8e8e;
  position: relative;
  width: fit-content;
  height: fit-content;
  display: flex;
`;

const Loading = styled.div`
  background-image: url(${loadingUpload});
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  position: absolute;
  width: 50%;
  height: 50%;
  top: 25%;
  left: 25%;
  margin: auto;
  z-index: -1;
  display: flex;
`;

const LoadingText = styled.div`
  width: 100%;
  position: absolute;
  text-align: center;
  bottom: 20%;
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
  allCanvasRef,
}) {
  const loadingRef = useRef([]);

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
            onMouseEnter={(e) => handleShowIcon(e, `page${page}-canvas${id}`)}
            onMouseLeave={(e) =>
              handleDisplayIcon(e, `page${page}-canvas${id}`)
            }
          >
            <Loading
              src={loadingUpload}
              ref={(el) => {
                loadingRef.current[index] = el;
              }}
              alt="loading"
            >
              <LoadingText>Loading...</LoadingText>
            </Loading>
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
              loadingRef={loadingRef.current[index]}
            />
            <MyCanvas
              id={`page${page}-canvas${id}`}
              ref={(el) => {
                allCanvasRef.current[`page${page}-canvas${id}`] = el;
              }}
            ></MyCanvas>
          </CanvasContainer>
        );
      })}
    </>
  );
}
