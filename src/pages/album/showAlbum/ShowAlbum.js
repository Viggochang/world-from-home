import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import SlideShow from "./slideShow/SlideShow";

import { templateStyle, allTemplateParams } from "../../../util/myTemplate";

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

const PageCanvasContainer = styled.div``;

const CanvasContainer = styled.div`
  position: relative;
`;

const MyCanvas = styled.canvas``;

export default function ShowAlbum({ albumContent, albumRef, allCanvasRef }) {
  const [pageInfo, setPageInfo] = useState({});
  const [canvasState, setCanvasState] = useState({});
  const canvasDivRef = useRef({});
  const pageCanvasContainerRef = useRef();

  useEffect(() => {
    setPageInfo(albumContent ? JSON.parse(albumContent.pageInfo) : {});
    setCanvasState(albumContent ? JSON.parse(albumContent.canvasState) : {});
  }, [albumContent]);

  useEffect(() => {
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
  }, [pageInfo, canvasState]);

  // useEffect(() => {
  //   window.onresize = () => {
  //     Object.values(canvas).forEach((canvas) => {
  //       console.log(
  //         canvas.width,
  //         pageCanvasContainerRef.current.clientWidth,
  //         800
  //       );
  //       const newWidth =
  //         (800 * pageCanvasContainerRef.current.clientWidth) / 820;
  //       const newHeight =
  //         (600 * pageCanvasContainerRef.current.clientWidth) / 820;
  //       canvas.setWidth(newWidth).setHeight(newHeight);
  //     });
  //   };

  //   return () => {
  //     window.onresize = null;
  //   };
  // }, [canvas]);

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
                style={templateStyle[templateId]}
              >
                {templateId === "slide_show_1" ? (
                  <SlideShow
                    canvasDivRef={canvasDivRef}
                    allCanvasRef={allCanvasRef}
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
                        <MyCanvas
                          id={`preview-page${page}-canvas${id}`}
                          ref={(el) =>
                            (allCanvasRef.current[
                              `preview-page${page}-canvas${id}`
                            ] = el)
                          }
                        />
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
