// 類似 Preview.js
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import SlideShow from "./slideShow/SlideShow";

import {
  templateStyle,
  allTemplateParams,
} from "../../edit/component/MyTemplate";

// import { db_gallery } from "../../../util/firebase";

const ShowDiv = styled.div`
  /* padding: 96px 0 100px 280px; */
  margin-top: 30px;
  /* background-color: #b8c3d0; */
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

const CanvasContainer = styled.div``;

const MyCanvas = styled.canvas``;

export default function ShowAlbum({ show, albumContent, albumRef }) {
  // const pageCanvasContainerRef = useRef();
  // const pageInfo = useSelector((state) => state.pageInfo);
  // const canvasState = useSelector((state) => state.canvasState);
  const [pageInfo, setPageInfo] = useState({});
  const [canvasState, setCanvasState] = useState({});
  const canvasDivRef = useRef({});

  useEffect(() => {
    setPageInfo(albumContent ? JSON.parse(albumContent.pageInfo) : {});
    setCanvasState(albumContent ? JSON.parse(albumContent.canvasState) : {});

    // if (albumIdShow) {
    //   db_gallery
    //     .doc(albumIdShow)
    //     .get()
    //     .then((doc) => {
    //       console.log(doc.data().content);
    //       const albumContent = doc.data().content;
    //       setPageInfo(
    //         albumContent.pageInfo ? JSON.parse(albumContent.pageInfo) : {}
    //       );
    //       setCanvasState(
    //         albumContent.canvasState ? JSON.parse(albumContent.canvasState) : {}
    //       );
    //     });
    // }
  }, [albumContent]);

  useEffect(() => {
    if (show) {
      if (Object.keys(pageInfo).length) {
        Object.values(pageInfo).forEach((pageInfo) => {
          const { page, templateId } = pageInfo;
          // console.log(pageInfo);
          // console.log(page, templateId);
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
            ); //重新renader出畫布上的物件
          });
        });
      }
    }
  }, [show, pageInfo, canvasState]);

  return (
    <ShowDiv style={{ display: show ? "flex" : "none" }} ref={albumRef}>
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
                // ref={pageCanvasContainerRef}
                style={templateStyle[templateId]}
              >
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
                        style={{ position: "relative" }}
                        key={`page${page}-canvas${id}`}
                        tabIndex="0"
                      >
                        <MyCanvas id={`preview-page${page}-canvas${id}`} />
                      </CanvasContainer>
                    );
                  })
                )}

                {/* {Array.from(new Array(canvasCount).keys()).map((id) => {
                  return (
                    <CanvasContainer
                      style={{ position: "relative" }}
                      key={`page${page}-canvas${id}`}
                      tabIndex="0"
                    >
                      <MyCanvas id={`preview-page${page}-canvas${id}`} />
                    </CanvasContainer>
                  );
                })} */}
              </PageCanvasContainer>
            </PageContainer>
          );
        })}
    </ShowDiv>
  );
}
