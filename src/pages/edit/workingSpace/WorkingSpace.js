import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import styled from "styled-components";

import RemovePage from "./removePage/RemovePage";
import TextEditor from "./textEditor/TextEditor";
import ImageEditor from "./imageEditor/ImageEditor";
import TemplateCanvas from "./templateCanvas/TemplateCanvas";
import SlideShow from "./slideShow/SlideShow";

import { templateStyle, allTemplateParams } from "../../../util/myTemplate";
import { getAlbumDataById } from "../../../util/firebase";

import {
  setCanvas,
  setPageInfo,
  setCanvasState,
  setActiveCanvas,
  setActiveObj,
  setEditUndo,
  setEditRedo,
  removeCanvas,
} from "../../../util/redux/action";

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
  height: calc(100vh - 160px);
  width: calc(100vw - 360px);
  margin: 20px 0;
  overflow: scroll;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 1200px) {
    width: calc(100vw - 112px);
    height: calc(100vh - 290px);
  }
  @media (max-width: 1000px) {
    width: 100vw;
  }
`;

const PageContainer = styled.div`
  position: relative;
  display: ${(props) => (props.display === "true" ? "block" : "none")};
`;

const PageCanvasContainer = styled.div``;

function WorkingSpace({
  preview,
  addWindow,
  removePageRef,
  canvasDivRef,
  allCanvasRef,
  handleEditHistory,
}) {
  const dispatch = useDispatch();
  const albumIdEditing = useSelector((state) => state.albumIdEditing);
  const canvas = useSelector((state) => state.canvas);
  const pageInfo = useSelector((state) => state.pageInfo);
  const canvasState = useSelector((state) => state.canvasState);
  const activeCanvas = useSelector((state) => state.activeCanvas);
  const editUndo = useSelector((state) => state.editUndo);

  const workingSpaceInnerRef = useRef();
  const pageCanvasContainerRef = useRef();
  const addTextRef = useRef({});
  const uploadImageRef = useRef({});
  const textEditorRef = useRef();
  const imageEditorRef = useRef();

  useEffect(() => {
    if (albumIdEditing) {
      async function loadCanvasFromDb() {
        const albumData = await getAlbumDataById(albumIdEditing);
        if (albumData.content) {
          const pageInfo = JSON.parse(albumData.content.pageInfo);
          const canvasState = JSON.parse(albumData.content.canvasState);
          dispatch(setPageInfo(pageInfo));
          dispatch(setCanvasState(canvasState));

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
                    dispatch(setCanvas(newCanvas));
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
      dispatch(
        newCanvas(
          newCanvas.reduce((acc, cur) => {
            acc[cur.lowerCanvasEl.id] = cur;
            return acc;
          }, {})
        )
      );
      // 儲存初始狀態
      dispatch(
        setCanvasState(
          newCanvas.reduce((acc, cur) => {
            acc[cur.lowerCanvasEl.id] = JSON.stringify(cur.toJSON());
            return acc;
          }, {})
        )
      );

      if (templateId === "text_1") {
        dispatch(setActiveCanvas(newCanvas[0]));
        dispatch(setActiveObj(newCanvas[0].getActiveObject()));
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

    dispatch(setEditUndo([...editUndo, record]));
    dispatch(setCanvasState(stateChange));
    dispatch(setEditRedo([]));
  }

  function handleKeyDown(event) {
    // redo
    if (
      (event.ctrlKey || event.metaKey) &&
      event.shiftKey &&
      (event.key === "z" || event.key === "Z")
    ) {
      handleEditHistory("REDO");
    } else if (
      (event.ctrlKey || event.metaKey) &&
      (event.key === "z" || event.key === "Z")
    ) {
      handleEditHistory("UNDO");
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
      dispatch(setActiveCanvas(thisCanvas));
      dispatch(setActiveObj(activeObj));
    }
  }

  function handleRemovePage(e, page) {
    const removePageObj = { ...pageInfo };
    removePageObj[`page${page}`].display = false;
    dispatch(removeCanvas(removePageObj));
    dispatch(setEditUndo([...editUndo, `page${page}`]));
    dispatch(setEditRedo([]));
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
                  removePageRef={removePageRef}
                  index={index}
                  page={page}
                  handleRemovePage={handleRemovePage}
                />
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
