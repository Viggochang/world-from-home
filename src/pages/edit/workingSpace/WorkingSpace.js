import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import styled from "styled-components";

import TextEditor from "./textEditor/TextEditor";
import ImageEditor from "./imageEditor/ImageEditor";
import TemplateCanvas from "./templateCanvas/TemplateCanvas";
import SlideShow from "./slideShow/SlideShow";

import { templateStyle, allTemplateParams } from "../../../util/myTemplate";
import { getAlbumDataById } from "../../../util/firebase";

const WorkingSpaceDiv = styled.div`
  background-color: #b8c3d0;
  padding-left: 360px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  @media (max-width: 1200px) {
    padding: 130px 0 0 112px;
  }
  @media (max-width: 1000px) {
    padding: 130px 0 0 0;
  }
`;

const WorkingSpaceDivInner = styled.div`
  height: calc(100vh - 310px);
  width: calc(100vw - 360px);
  margin: 20px 0;
  overflow: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 1200px) {
    width: calc(100vw - 112px);
  }
  @media (max-width: 1000px) {
    width: 100vw;
  }
`;

const PageContainer = styled.div`
  position: relative;
  display: ${(props) => (props.display === "true" ? "block" : "none")};
`;

const RemovePage = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  right: -40px;
  font-size: 18px;
  color: #3a4a58;
  line-height: 30px;
  cursor: pointer;
  :hover {
    background-color: rgb(255, 255, 255, 0.4);
  }
`;

const PageCanvasContainer = styled.div``;

function WorkingSpace({
  preview,
  addWindow,
  removePageRef,
  canvasDivRef,
  allCanvasRef,
}) {
  const dispatch = useDispatch();
  const albumIdEditing = useSelector((state) => state.albumIdEditing);
  const canvas = useSelector((state) => state.canvas);
  const pageInfo = useSelector((state) => state.pageInfo);
  const canvasState = useSelector((state) => state.canvasState);
  const activeCanvas = useSelector((state) => state.activeCanvas);
  const editUndo = useSelector((state) => state.editUndo);
  const editRedo = useSelector((state) => state.editRedo);

  const workingSpaceInnerRef = useRef();
  const pageCanvasContainerRef = useRef();
  const addTextRef = useRef({});
  const uploadImageRef = useRef({});
  const textEditorRef = useRef();
  const imageEditorRef = useRef();

  // 畫布縮放功能在這
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

  useEffect(() => {
    if (albumIdEditing) {
      async function loadCanvasFromDb() {
        const albumData = await getAlbumDataById(albumIdEditing);
        if (albumData.content) {
          const pageInfo = JSON.parse(albumData.content.pageInfo);
          const canvasState = JSON.parse(albumData.content.canvasState);
          dispatch({
            type: "SET_PAGE_INFO",
            payload: pageInfo,
          });
          dispatch({
            type: "SET_CANVAS_STATE",
            payload: canvasState,
          });

          Object.values(pageInfo).forEach(({ page, templateId }) => {
            allTemplateParams()
              [templateId](page)
              .forEach((canvas) => {
                const newCanvas = {};
                canvas.loadFromJSON(
                  canvasState[canvas.lowerCanvasEl.id],
                  () => {
                    newCanvas[canvas.lowerCanvasEl.id] = canvas;
                    canvas.getObjects().forEach((obj) => {
                      if (obj.type === "i-text") {
                        obj.setControlsVisibility({
                          mt: false,
                          mb: false,
                          ml: false,
                          mr: false,
                          bl: false,
                          br: false,
                          tl: false,
                          tr: false,
                        });
                      }
                    });
                    canvas.renderAll();
                    dispatch({
                      type: "SET_CANVAS",
                      payload: newCanvas,
                    });
                  }
                );
              });
          });
        }
      }
      loadCanvasFromDb();
    }
  }, [albumIdEditing]);

  useEffect(() => {
    const pageLength = Object.keys(pageInfo).length;
    if (addWindow && pageLength) {
      const { page, templateId } = Object.values(pageInfo).sort(
        (a, b) => a.page - b.page
      )[pageLength - 1];
      const newCanvas = allTemplateParams()[templateId](page);
      // 儲存每一個canvas
      dispatch({
        type: "SET_CANVAS",
        payload: newCanvas.reduce((acc, cur) => {
          acc[cur.lowerCanvasEl.id] = cur;
          return acc;
        }, {}),
      });
      // 儲存初始狀態
      dispatch({
        type: "SET_CANVAS_STATE",
        payload: newCanvas.reduce((acc, cur) => {
          acc[cur.lowerCanvasEl.id] = JSON.stringify(cur.toJSON());
          return acc;
        }, {}),
      });

      if (templateId === "text_1") {
        dispatch({
          type: "SET_ACTIVE_CANVAS",
          payload: newCanvas[0],
        });
        dispatch({
          type: "SET_ACTIVE_OBJ",
          payload: newCanvas[0].getActiveObject(),
        });
      }
    }
    workingSpaceInnerRef.current.scrollTop =
      workingSpaceInnerRef.current.scrollHeight;
  }, [pageInfo]);

  useEffect(() => {
    Object.values(canvas).forEach((canvas) => {
      canvas.selectable = !preview;
      canvas.getObjects().forEach((obj) => {
        obj.selectable = !preview;
      });
      canvas.renderAll();
    });
  }, [preview]);

  useEffect(() => {
    const modified = {
      "object:modified": (e) => {
        handleCanvasOn(e.target.canvas);
      },
    };
    Object.entries(canvas).forEach((canvas) => {
      canvas[1].on(modified);
    });

    return () => {
      Object.entries(canvas).forEach((canvas) => {
        canvas[1].off(modified);
      });
    };
  }, [canvas, editUndo, canvasState]);

  // canvas有變動時執行
  function handleCanvasOn(canvas) {
    const record = {};
    record[canvas.lowerCanvasEl.id] = canvasState[canvas.lowerCanvasEl.id];
    const stateChange = {};
    stateChange[canvas.lowerCanvasEl.id] = JSON.stringify(canvas.toJSON());

    dispatch({
      type: "UNDO",
      payload: [...editUndo, record],
    });
    dispatch({
      type: "SET_CANVAS_STATE",
      payload: stateChange,
    });
    dispatch({
      type: "REDO",
      payload: [],
    });
  }

  function handleKeyDown(event) {
    // redo
    if (
      (event.ctrlKey || event.metaKey) &&
      event.shiftKey &&
      (event.key === "z" || event.key === "Z")
    ) {
      if (Object.keys(editRedo).length < 1) {
      } else {
        const latestState = editRedo[Object.keys(editRedo).length - 1];
        let record = {};

        if (typeof latestState === "string") {
          const pageInfoObj = {};
          pageInfoObj[latestState] = {
            ...pageInfo[latestState],
            display: pageInfo[latestState].display ? false : true,
          };
          dispatch({
            type: "SET_PAGE_INFO",
            payload: pageInfoObj,
          });
          record = latestState;
        } else {
          canvas[Object.keys(latestState)[0]].loadFromJSON(
            Object.values(latestState)[0]
          );
          const activeId = Object.keys(latestState)[0];
          record[activeId] = canvasState[activeId];

          dispatch({
            type: "SET_CANVAS_STATE",
            payload: latestState,
          });
        }

        dispatch({
          type: "REDO",
          payload: editRedo.slice(0, editRedo.length - 1),
        });

        dispatch({
          type: "UNDO",
          payload: [...editUndo, record],
        });
      }
      // undo
    } else if (
      (event.ctrlKey || event.metaKey) &&
      (event.key === "z" || event.key === "Z")
    ) {
      if (Object.keys(editUndo).length < 1) {
      } else {
        const latestState = editUndo[Object.keys(editUndo).length - 1];
        let redoRecord = {};
        // 如果是刪除page，會存入pageId
        if (typeof latestState === "string") {
          const pageInfoObj = {};
          pageInfoObj[latestState] = {
            ...pageInfo[latestState],
            display: pageInfo[latestState].display ? false : true,
          };
          dispatch({
            type: "SET_PAGE_INFO",
            payload: pageInfoObj,
          });
          redoRecord = latestState;
        } else {
          canvas[Object.keys(latestState)[0]].loadFromJSON(
            Object.values(latestState)[0]
          );
          const activeId = Object.keys(latestState)[0];
          redoRecord[activeId] = canvasState[activeId];

          dispatch({
            type: "SET_CANVAS_STATE",
            payload: latestState,
          });
        }

        dispatch({
          type: "UNDO",
          payload: editUndo.slice(0, editUndo.length - 1),
        });

        dispatch({
          type: "REDO",
          payload: [...editRedo, redoRecord],
        });
      }
    } else if (event.key === "Delete" || event.key === "Backspace") {
      handleDelete();
    }
  }

  function handleDelete() {
    const thisCanvas = activeCanvas;
    if (Object.keys(thisCanvas).length && thisCanvas.getActiveObject()) {
      thisCanvas.remove(thisCanvas.getActiveObject());
      handleCanvasOn(thisCanvas);
    }
    textEditorRef.current.style.zIndex = -1;
    imageEditorRef.current.style.zIndex = -1;
  }

  function getActiveCanvas(e) {
    let [thisCanvasId, thisCanvas, activeObj] = [undefined, {}, {}];

    if (e.target.classList.contains("upper-canvas")) {
      thisCanvasId = e.target.parentNode.children[0].id;
      if (
        Object.keys(activeCanvas).length &&
        activeCanvas.lowerCanvasEl.id !== thisCanvasId
      ) {
        activeCanvas.discardActiveObject().renderAll();
      }
      if (thisCanvasId) {
        thisCanvas = canvas[thisCanvasId];
        if (thisCanvas.getActiveObject()) {
          activeObj = thisCanvas.getActiveObject();
        }
      }
    } else {
      if (Object.keys(activeCanvas).length) {
        activeCanvas.discardActiveObject().renderAll();
      }
    }

    if (
      !textEditorRef.current.contains(e.target) &&
      !imageEditorRef.current.contains(e.target)
    ) {
      dispatch({
        type: "SET_ACTIVE_CANVAS",
        payload: thisCanvas,
      });
      dispatch({
        type: "SET_ACTIVE_OBJ",
        payload: activeObj,
      });
    }
  }

  function handleRemovePage(e, page) {
    const removePageObj = { ...pageInfo };
    removePageObj[`page${page}`].display = false;
    dispatch({
      type: "REMOVE_CANVAS",
      payload: removePageObj,
    });
    dispatch({
      type: "UNDO",
      payload: [...editUndo, `page${page}`],
    });
    dispatch({
      type: "REDO",
      payload: [],
    });
  }

  return (
    <WorkingSpaceDiv
      onKeyDown={handleKeyDown}
      onClick={getActiveCanvas}
      tabIndex="0"
    >
      <TextEditor
        textEditorRef={textEditorRef}
        handleCanvasOn={handleCanvasOn}
      />
      <ImageEditor
        imageEditorRef={imageEditorRef}
        handleCanvasOn={handleCanvasOn}
      />
      <WorkingSpaceDivInner ref={workingSpaceInnerRef}>
        {Object.values(pageInfo)
          .sort((a, b) => a.page - b.page)
          .map((pageInfo, index) => {
            const { page, canvasCount, templateId, display } = pageInfo;
            return (
              <PageContainer
                key={`page${page}`}
                display={(!!display && display).toString()}
              >
                <RemovePage
                  ref={(el) => (removePageRef.current[index] = el)}
                  onClick={(e) => handleRemovePage(e, page)}
                >
                  <i className="fas fa-trash-alt" />
                </RemovePage>
                <PageCanvasContainer
                  ref={pageCanvasContainerRef}
                  style={templateStyle[templateId]} // page的style格式
                >
                  {templateId === "slide_show_1" ? (
                    <SlideShow
                      canvasCount={canvasCount}
                      canvasDivRef={canvasDivRef}
                      page={page}
                      preview={preview}
                      addTextRef={addTextRef}
                      uploadImageRef={uploadImageRef}
                      handleCanvasOn={handleCanvasOn}
                      allCanvasRef={allCanvasRef}
                    />
                  ) : (
                    <TemplateCanvas
                      canvasCount={canvasCount}
                      canvasDivRef={canvasDivRef}
                      page={page}
                      preview={preview}
                      addTextRef={addTextRef}
                      uploadImageRef={uploadImageRef}
                      handleCanvasOn={handleCanvasOn}
                      allCanvasRef={allCanvasRef}
                    />
                  )}
                </PageCanvasContainer>
              </PageContainer>
            );
          })}
      </WorkingSpaceDivInner>
    </WorkingSpaceDiv>
  );
}

export default WorkingSpace;
