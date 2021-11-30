import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import SlideShow from "./slideShow/SlideShow";

import { templateStyle, cavasStyle } from "../../../util/myTemplate";

const ShowDiv = styled.div`
  margin-top: 30px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const PageContainer = styled.div`
  position: relative;
  display: ${(props) => (props.display === "true" ? "block" : "none")};
`;

const PageCanvasContainer = styled.div`
  ${(props) => props.templateStyle}
  @media(max-width: 1200px) {
    width: ${({ templateStyle: { width } }) =>
      Number(width.split("px")[0]) / 12}vw;
    height: ${({ templateStyle: { height } }) =>
      Number(height.split("px")[0]) / 12}vw;
    padding-top: ${({ templateStyle: { padding } }) =>
      padding && Number(padding.split("px")[0]) / 12}vw;
    padding-bottom: ${({ templateStyle: { padding } }) =>
      padding && Number(padding.split("px")[0]) / 12}vw;
    padding-left: ${({ templateStyle: { padding } }) =>
      padding && Number(padding.split("px")[1]) / 12}vw;
    padding-right: ${({ templateStyle: { padding } }) =>
      padding && Number(padding.split("px")[1]) / 12}vw;
  }
`;

const CanvasContainer = styled.div`
  position: relative;
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  @media (max-width: 1200px) {
    width: ${(props) => Number(props.width) / 12}vw;
    height: ${(props) => Number(props.height) / 12}vw;
  }
`;
const CanvasImg = styled.img`
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  @media (max-width: 1200px) {
    width: ${(props) => Number(props.width) / 12}vw;
    height: ${(props) => Number(props.height) / 12}vw;
  }
`;

const MyCanvas = styled.canvas``;

export default function ShowAlbum({ albumContent, completeCanvas, albumRef }) {
  const [pageInfo, setPageInfo] = useState({});

  const canvasDivRef = useRef({});
  const pageCanvasContainerRef = useRef();

  useEffect(() => {
    setPageInfo(albumContent ? JSON.parse(albumContent.pageInfo) : {});
  }, [albumContent]);

  return (
    <ShowDiv ref={albumRef}>
      {Object.values(pageInfo)
        .sort((a, b) => a.page - b.page)
        .filter((pageInfo) => pageInfo.display)
        .map((pageInfo) => {
          const { page, canvasCount, templateId, display } = pageInfo;
          return (
            <PageContainer
              key={`page${page}`}
              display={(!!display && display).toString()}
            >
              <PageCanvasContainer
                ref={pageCanvasContainerRef}
                templateStyle={templateStyle[templateId]}
              >
                {templateId === "slide_show_1" ? (
                  <SlideShow
                    canvasDivRef={canvasDivRef}
                    page={page}
                    canvasCount={canvasCount}
                    completeCanvas={completeCanvas}
                  />
                ) : (
                  Array.from(new Array(canvasCount).keys()).map((id, index) => {
                    const { height, width } = Object.values(
                      cavasStyle[templateId]
                    )[index];
                    return (
                      <CanvasContainer
                        key={`page${page}-canvas${id}`}
                        tabIndex="0"
                        height={height}
                        width={width}
                      >
                        <CanvasImg
                          src={completeCanvas[`page${page}-canvas${id}`]}
                          alt={`page${page}-canvas${id}`}
                          height={height}
                          width={width}
                        />
                        {/* <MyCanvas id={`preview-page${page}-canvas${id}`} /> */}
                      </CanvasContainer>
                    );
                  })
                )}
              </PageCanvasContainer>
            </PageContainer>
          );
        })}
    </ShowDiv>
  );
}
