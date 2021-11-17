import { fabric } from "fabric";
import { useSelector, useDispatch } from "react-redux";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import Tooltip from "@mui/material/Tooltip";

import styled from "styled-components";

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
  color: #667484;
  :hover {
    background-color: rgb(255, 255, 255, 0.6);
    color: #3a4a58;
  }
`;

function AddText({ page, id }) {
  const canvas = useSelector((state) => state.canvas);
  const canvasState = useSelector((state) => state.canvasState);
  const editUndo = useSelector((state) => state.editUndo);
  const dispatch = useDispatch();

  const handleAddText = (event, id) => {
    event.preventDefault();
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

    const record = {};
    record[thisCanvas.lowerCanvasEl.id] =
      canvasState[thisCanvas.lowerCanvasEl.id];
    const stateChange = {};
    stateChange[thisCanvas.lowerCanvasEl.id] = JSON.stringify(
      thisCanvas.toJSON()
    );

    dispatch({
      type: "UNDO",
      payload: [...editUndo, record],
    });
    dispatch({
      type: "SET_CANVAS_STATE",
      payload: stateChange,
    });
  };

  return (
    <Tooltip title="new text" placement="left">
      <AddTextDiv onClick={(e) => handleAddText(e, `page${page}-canvas${id}`)}>
        {/* <i className="fas fa-font"></i> */}
        <TextFieldsIcon />
      </AddTextDiv>
    </Tooltip>
  );
}

export default AddText;
