import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import { templateStyle, allTemplateParams } from "./MyTemplate";

const PreviewDiv = styled.div`
  background-color: #b8c3d0;
  padding-left: 360px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const WorkingSpaceDivInner = styled.div`
  height: calc(100vh - 160px);
  width: calc(100vw - 360px);
  margin: 20px 0;
  overflow: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PageContainer = styled.div`
  position: relative;
`;

const PageCanvasContainer = styled.div``;

const CanvasContainer = styled.div`
  :focus {
    outline: 1px #667484 solid;
  }
`;

const MyCanvas = styled.canvas``;

export default function Preview({ preview }) {
  const pageCanvasContainerRef = useRef();
  const pageInfo = useSelector((state) => state.pageInfo);
  const canvasState = useSelector((state) => state.canvasState);

  useEffect(() => {
    if (preview) {
      const pageLength = Object.keys(pageInfo).length;
      if (pageLength) {
        Object.values(pageInfo).forEach((pageInfo) => {
          const { page, templateId } = pageInfo;
          const CanvasInPage = allTemplateParams("preview")[templateId](page);
          CanvasInPage.forEach((canvas) => {
            // let canvasId = canvas.lowerCanvasEl.id.split("preview-")[1];
            // const [canvasWeight, canvasHeight] = [
            //   canvas.getWidth(),
            //   canvas.getHeight(),
            // ];

            // let canvasObj = JSON.parse(canvasState[canvasId]);
            // canvasObj["objects"] = canvasObj["objects"].map((object) => {
            //   if (object.type === "image") {
            //     // object.scaleX=
            //   }
            // });
            canvas.loadFromJSON(
              canvasState[canvas.lowerCanvasEl.id.split("preview-")[1]],
              () => {
                canvas.selectable = false;
                canvas.getObjects().forEach((obj) => {
                  obj.selectable = false;
                });
                canvas.renderAll();
              }
            ); //重新renader出畫布上的物件
          });
        });
      }
    }
  }, [preview]);

  return (
    <PreviewDiv style={{ display: preview ? "flex" : "none" }}>
      <WorkingSpaceDivInner>
        {Object.values(pageInfo)
          .sort((a, b) => a.page - b.page)
          .map((pageInfo) => {
            const { page, canvasCount, templateId, display } = pageInfo;
            return (
              <PageContainer
                key={`page${page}`}
                style={{ display: display ? "block" : "none" }}
              >
                <PageCanvasContainer
                  ref={pageCanvasContainerRef}
                  style={templateStyle[templateId]}
                >
                  {Array.from(new Array(canvasCount).keys()).map((id) => {
                    return (
                      <CanvasContainer
                        style={{ position: "relative" }}
                        key={`page${page}-canvas${id}`}
                        tabIndex="0"
                      >
                        <MyCanvas id={`preview-page${page}-canvas${id}`} />
                      </CanvasContainer>
                    );
                  })}
                </PageCanvasContainer>
              </PageContainer>
            );
          })}
      </WorkingSpaceDivInner>
    </PreviewDiv>
  );
}
