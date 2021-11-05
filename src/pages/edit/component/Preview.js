import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import { templateStyle, allTemplateParams } from "./MyTemplate";

import firebase from "../../../util/firebase";

const PreviewDiv = styled.div`
  padding: 96px 0 100px 280px;
  background-color: #b8c3d0;
  flex-grow: 1;
  display: none;
  flex-direction: column;
  align-items: center;
  position: relative;
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
            canvas.loadFromJSON(
              canvasState[canvas.lowerCanvasEl.id.split("preview-")[1]]
            ); //重新renader出畫布上的物件
          });
        });
      }
    }
  }, [preview]);

  return (
    <PreviewDiv style={{ display: preview ? "flex" : "none" }}>
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
    </PreviewDiv>
  );
}
