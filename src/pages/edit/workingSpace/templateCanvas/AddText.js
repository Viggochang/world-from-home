import { fabric } from "fabric";
import { useSelector, useDispatch } from "react-redux";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import Tooltip from "@mui/material/Tooltip";

import styled from "styled-components";
import deleteIcon from "../../../../image/deleteIcon/delete_icon.png";
import {
  setCanvasState,
  setActiveCanvas,
  setActiveObj,
  setEditUndo,
} from "../../../../redux/action";

let deleteIconImg = document.createElement("img");
deleteIconImg.src = deleteIcon;

const AddTextDiv = styled.div`
  display: flex;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: -1;
  top: 10px;
  right: 10px;
  padding: 5px;
  text-align: center;
  cursor: pointer;
  color: #3a4a58;
  background-color: rgb(255, 255, 255, 0.3);
  :hover {
    background-color: rgb(255, 255, 255, 0.6);
  }
`;

function AddText({ page, id, addTextRef, handleCanvasOn }) {
  const canvas = useSelector((state) => state.canvas);
  const canvasState = useSelector((state) => state.canvasState);
  const editUndo = useSelector((state) => state.editUndo);
  const activeCanvas = useSelector((state) => state.activeCanvas);
  const dispatch = useDispatch();

  function deleteObject(eventData, transform) {
    let target = transform.target;
    let canvas = target.canvas;
    canvas.remove(target);
    canvas.requestRenderAll();
    handleCanvasOn(activeCanvas);
  }

  function renderIcon(ctx, left, top, styleOverride, fabricObject) {
    let size = this.cornerSize;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.drawImage(deleteIconImg, -size / 2, -size / 2, 1.3 * size, size);
    ctx.restore();
  }

  fabric.IText.prototype.controls.deleteControl = new fabric.Control({
    x: 0.52,
    y: -1,
    offsetY: 16,
    cursorStyle: "pointer",
    mouseUpHandler: deleteObject,
    render: renderIcon,
    cornerSize: 16,
  });

  const handleAddText = (event, id) => {
    event.stopPropagation();

    if (Object.keys(activeCanvas).length) {
      activeCanvas.discardActiveObject().renderAll();
    }
    dispatch(setActiveCanvas(canvas[id]));

    const thisCanvas = canvas[id];
    const newText = new fabric.IText("edit", {
      left: 50,
      top: 50,
      fontSize: 20,
      fontFamily: "helvetica",
    });
    newText.setControlsVisibility({
      mt: false,
      mb: false,
      ml: false,
      mr: false,
      bl: false,
      br: false,
      tl: false,
      tr: false,
    });
    thisCanvas.add(newText);
    thisCanvas.setActiveObject(newText);

    const record = {};
    record[thisCanvas.lowerCanvasEl.id] =
      canvasState[thisCanvas.lowerCanvasEl.id];
    const stateChange = {};
    stateChange[thisCanvas.lowerCanvasEl.id] = JSON.stringify(
      thisCanvas.toJSON()
    );

    dispatch(setEditUndo([...editUndo, record]));
    dispatch(setCanvasState(stateChange));
    dispatch(setActiveObj(thisCanvas.getActiveObject()));
  };

  return (
    <Tooltip title="new text" placement="left">
      <AddTextDiv
        ref={(el) => {
          addTextRef.current[`page${page}-canvas${id}`] = el;
        }}
        onClick={(e) => handleAddText(e, `page${page}-canvas${id}`)}
      >
        <TextFieldsIcon />
      </AddTextDiv>
    </Tooltip>
  );
}

export default AddText;
