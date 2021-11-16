import { fabric } from "fabric";
import { useSelector, useDispatch } from "react-redux";

import styled from "styled-components";

const AddTextDiv = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 1;
  top: 10px;
  right: 10px;
  padding: 5px;
  text-align: center;
  cursor: pointer;
  color: #667484;
  :hover {
    background-color: rgb(184, 195, 208, 0.2);
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
    <AddTextDiv onClick={(e) => handleAddText(e, `page${page}-canvas${id}`)}>
      <i className="fas fa-edit"></i>
    </AddTextDiv>
  );
}

export default AddText;
