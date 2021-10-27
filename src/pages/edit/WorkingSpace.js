import React, { useEffect, useRef } from "react";
// import { fabric } from "fabric";
import { useSelector, useDispatch } from "react-redux";

import styled from "styled-components";

import UploadImage from "./component/UploadImage";
import AddText from "./component/AddText";
import TextEditor from "./component/TextEditor";

import { templateStyle, allTemplateParams } from "./component/MyTemplate";

const WorkingSpaceDiv = styled.div`
  /* padding-left: 352px;
  padding-top: 48px; */
  padding: 96px 0 100px 280px;
  background-color: #b8c3d0;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const PageContainer = styled.div`
  /* margin: 20px 0; */
  /* padding-top: 30px; */
  position: relative;
`;

const RemoveWindow = styled.div`
  position: absolute;
  top: 0;
  right: -30px;
  font-size: 18px;
  color: #3a4a58;
  line-height: 30px;
  cursor: pointer;
`;

const PageCanvasContainer = styled.div`
  /* width: 800px;
  height: 600px;
  border-bottom: 0.5px #B8C3D0 dashed;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-content: space-between;
  flex-wrap: wrap;   */

  /* width: calc(100vw - 610px); */
  /* aspect-ratio: calc(4 / 3); */

  /* margin: 20px 0; */
  /* box-shadow: 0px 0px 10px #bbbbbb; */

  /* padding: 10px; */
  /* margin: 0 100px; */
`;

const CanvasContainer = styled.div`
  :focus {
    /* outline: 1px #667484 solid; */
    box-shadow: 0px 0px 5px #6C6C6C;
    z-index: 2;
  }
`;

const MyCanvas = styled.canvas``;

function WorkingSpace({preview}) {
  const dispatch = useDispatch();
  const canvas = useSelector((state) => state.canvas);
  const pageInfo = useSelector((state) => state.pageInfo);
  const canvasState = useSelector((state) => state.canvasState);
  const activeCanvas = useSelector((state) => state.activeCanvas);
  const editUndo = useSelector((state) => state.editUndo);
  const editRedo = useSelector((state) => state.editRedo);
  
  const workingSpaceRef = useRef();
  const pageCanvasContainerRef = useRef();
  const textEditorRef = useRef();

  // // 畫布縮放功能在這
  // useEffect(() => {
  //   window.onresize = () => {
  //     Object.values(canvas).forEach(canvas => {
  //       console.log(canvas.width, pageCanvasContainerRef.current.clientWidth, 800);
  //       const newWidth = 800 * pageCanvasContainerRef.current.clientWidth / 820;
  //       const newHeight = 600 * pageCanvasContainerRef.current.clientWidth / 820;
  //       canvas.setWidth(newWidth).setHeight(newHeight);
  //     })
  //   };

  //   return () => {
  //     window.onresize = null;
  //   }
  // }, [canvas])

  useEffect(() => {
    // const allCanvas = initCanvas();
    const pageLength = Object.keys(pageInfo).length;
    if (pageLength) {
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
          // acc[cur.lowerCanvasEl.id] = cur.toJSON();
          acc[cur.lowerCanvasEl.id] = JSON.stringify(cur.toJSON());
          return acc;
        }, {}),
      });
    }
    window.scrollTo(0, workingSpaceRef.current.offsetHeight);
  }, [pageInfo]);

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

  function handleCanvasOn(canvas) {
    const record = {};
    record[canvas.lowerCanvasEl.id] = canvasState[canvas.lowerCanvasEl.id];
    const stateChange = {};
    // stateChange[canvas.lowerCanvasEl.id] = canvas.toJSON();
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

  function handleUndo(event) {
    // redo
    if (
      (event.ctrlKey || event.metaKey) &&
      event.shiftKey &&
      (event.key === "z" || event.key === "Z")
    ) {
      if (Object.keys(editRedo).length < 1) {
        console.log("目前沒有動作可復原");
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
        console.log("目前沒有動作可復原");
      } else {
        const latestState = editUndo[Object.keys(editUndo).length - 1];
        let redoRecord = {};
        if (typeof latestState === "string") {
          console.log(latestState);
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
          console.log(activeId, canvasState, canvasState[activeId]);
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
      handleDelete(event);
    }
  }

  function handleDelete(e) {
    const thisCanvas = activeCanvas;
    if (Object.keys(thisCanvas).length && thisCanvas.getActiveObject()) {
      thisCanvas.remove(thisCanvas.getActiveObject());
      handleCanvasOn(thisCanvas);
    }
  }

  function getActiveCanvas(e) {
    let [thisCanvasId, activeCanvas, activeObj] = [undefined, {}, {}];

    if (e.target.classList.contains("upper-canvas")) {
      thisCanvasId = e.target.parentNode.children[0].id;
      if (thisCanvasId) {
        activeCanvas = canvas[thisCanvasId];
        if (activeCanvas.getActiveObject()) {
          activeObj = activeCanvas.getActiveObject();
        }
      }
    }

    if (!textEditorRef.current || !textEditorRef.current.contains(e.target)) {
      dispatch({
        type: "SET_ACTIVE_CANVAS",
        payload: activeCanvas,
      });
      dispatch({
        type: "SET_ACTIVE_OBJ",
        payload: activeObj,
      });
    }
    console.log("activeCanvasId:", thisCanvasId);
    console.log(textEditorRef.current.contains(e.target));
  }

  function handleRemoveWindow(e, page) {
    // e.target.parentNode.innerHTML = '';
    console.log(page, Object.keys(pageInfo));
    // e.target.parentNode.parentNode.parentNode.removeChild(
    //   e.target.parentNode.parentNode
    // );
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
      onKeyDown={(e) => handleUndo(e)}
      onClick={(e) => getActiveCanvas(e)}
      tabIndex="0"
      style={{display: preview ? 'none' : 'flex'}}
      ref={workingSpaceRef}
    >
      <TextEditor innerRef={textEditorRef} handleCanvasOn={handleCanvasOn} />
      {Object.values(pageInfo)
        .sort((a, b) => a.page - b.page)
        .map((pageInfo) => {
          const { page, canvasCount, templateId, display } = pageInfo;
          return (
            <PageContainer
              key={`page${page}`}
              style={{ display: display ? "block" : "none" }}
            >
              {/* <PageTitle>{`第${page + 1}頁`}</PageTitle> */}
              <RemoveWindow onClick={(e) => handleRemoveWindow(e, page)}>
                <i className="fas fa-trash-alt"></i>
              </RemoveWindow>
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
                      <AddText page={page} id={id} />
                      <UploadImage page={page} id={id} />
                      <MyCanvas id={`page${page}-canvas${id}`} />
                    </CanvasContainer>
                  );
                })}
              </PageCanvasContainer>
            </PageContainer>
          );
        })}
    </WorkingSpaceDiv>
  );
}

export default WorkingSpace;
