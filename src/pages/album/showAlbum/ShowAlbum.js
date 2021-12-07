import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import SlideShow from "./slideShow/SlideShow";

import { templateStyle, cavasStyle } from "../../../util/myTemplate";
import loading from "../../../image/loading/loading.gif";

const LoadingDiv = styled.div`
  background-image: url(${loading});
  background-position: center;
  background-size: cover;
  position: absolute;
  top: 200px;
  left: calc(50% - 400px);
  height: 450px;
  width: 600px;
  margin-left: 100px;
  color: white;
  @media (max-width: 1200px) {
    width: ${600 / 12}vw;
    height: ${450 / 12}vw;
    margin-left: ${100 / 12}vw;
    left: calc(50% - 33.33vw);
  }
  @media (max-width: 750px) {
    top: 100px;
  }
`;

const ShowDiv = styled.div`
  margin-top: 30px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  opacity: 0;
  transition: opacity 1s;
`;

const PageContainer = styled.div`
  position: relative;
  display: ${(props) => (props.display === "true" ? "block" : "none")};
`;

const PageCanvasContainer = styled.div`
  ${(props) => props.templateStyle}
  @media (max-width: 1200px) {
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
  background-color: rgb(0, 0, 0, 0.9);
  @media (max-width: 1200px) {
    width: ${(props) => Number(props.width) / 12}vw;
    height: ${(props) => Number(props.height) / 12}vw;
  }
`;

export default function ShowAlbum({
  albumContent,
  completeCanvas,
  albumRef,
  loadingRef,
}) {
  const [pageInfo, setPageInfo] = useState({});
  const [onLoadCount, setOnLoadCount] = useState(0);

  const canvasDivRef = useRef({});
  const pageCanvasContainerRef = useRef();

  useEffect(() => {
    setPageInfo(albumContent ? JSON.parse(albumContent.pageInfo) : {});
    setOnLoadCount(0);
  }, [albumContent]);

  const canvasTotal =
    Object.keys(pageInfo).length &&
    Object.values(pageInfo)
      .filter((pageinfo) => pageinfo.display)
      .reduce((acc, cur) => {
        return acc + cur.canvasCount;
      }, 0);

  function handleOnLoad() {
    setOnLoadCount((onLoadCount) => onLoadCount + 1);
    console.log(onLoadCount + 1, canvasTotal);
    if (canvasTotal && onLoadCount + 1 === canvasTotal) {
      loadingRef.current.style.display = "none";
      albumRef.current.style.opacity = 1;
    }
  }

  return (
    <>
      <LoadingDiv
        ref={loadingRef}
      >{`${onLoadCount} / ${canvasTotal}`}</LoadingDiv>
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
                      handleOnLoad={handleOnLoad}
                    />
                  ) : (
                    Array.from(new Array(canvasCount).keys()).map(
                      (id, index) => {
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
                              src={
                                completeCanvas
                                  ? completeCanvas[`page${page}-canvas${id}`]
                                  : ""
                              }
                              alt={`page${page}-canvas${id}`}
                              height={height}
                              width={width}
                              onLoad={handleOnLoad}
                            />
                          </CanvasContainer>
                        );
                      }
                    )
                  )}
                </PageCanvasContainer>
              </PageContainer>
            );
          })}
      </ShowDiv>
    </>
  );
}
