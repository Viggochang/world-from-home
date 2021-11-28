// 類似 Preview.js
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import SlideShow from "./slideShow/SlideShow";

import { templateStyle, allTemplateParams } from "../../../util/myTemplate";

const ShowDiv = styled.div`
  margin-top: 30px;
  flex-grow: 1;
  display: ${(props) => (props.show === "true" ? "flex" : "none")};
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const PageContainer = styled.div`
  position: relative;
  display: ${(props) => (props.display === "true" ? "block" : "none")};
`;

const PageCanvasContainer = styled.div``;

const CanvasContainer = styled.div`
  position: relative;
`;

const MyCanvas = styled.canvas``;

export default function ShowAlbum({ show, albumContent, albumRef }) {
  const [pageInfo, setPageInfo] = useState({});
  const [canvasState, setCanvasState] = useState({});
  const canvasDivRef = useRef({});

  useEffect(() => {
    setPageInfo(albumContent ? JSON.parse(albumContent.pageInfo) : {});
    setCanvasState(albumContent ? JSON.parse(albumContent.canvasState) : {});
  }, [albumContent]);

  useEffect(() => {
    if (show) {
      if (Object.keys(pageInfo).length) {
        Object.values(pageInfo).forEach((pageInfo) => {
          const { page, templateId } = pageInfo;
          const CanvasInPage = allTemplateParams("show")[templateId](page);
          CanvasInPage.forEach((canvas) => {
            canvas.loadFromJSON(
              canvasState[canvas.lowerCanvasEl.id.split("preview-")[1]],
              () => {
                canvas.selectable = false;
                canvas.getObjects().forEach((obj) => {
                  obj.selectable = false;
                });
                canvas.backgroundColor = "#ffffff";
                canvas.renderAll();
              }
            );
          });
        });
      }
    }
  }, [show, pageInfo, canvasState]);

  return (
    <ShowDiv show={show.toString()} ref={albumRef}>
      {Object.values(pageInfo)
        .sort((a, b) => a.page - b.page)
        .map((pageInfo) => {
          const { page, canvasCount, templateId, display } = pageInfo;
          return (
            <PageContainer
              key={`page${page}`}
              display={!!display && display.toString()}
            >
              <PageCanvasContainer style={templateStyle[templateId]}>
                {templateId === "slide_show_1" ? (
                  <SlideShow
                    canvasDivRef={canvasDivRef}
                    page={page}
                    canvasCount={canvasCount}
                  />
                ) : (
                  Array.from(new Array(canvasCount).keys()).map((id) => {
                    return (
                      <CanvasContainer
                        key={`page${page}-canvas${id}`}
                        tabIndex="0"
                      >
                        <MyCanvas id={`preview-page${page}-canvas${id}`} />
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