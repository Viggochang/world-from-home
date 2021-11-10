import { React, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";

import { SliderPicker, CompactPicker } from "react-color";

const TextEditorDiv = styled.div`
  /* outline: 1px black solid; */
  box-shadow: 0px 0px 10px #bbbbbb;
  padding: 10px;
  position: fixed;
  margin-right: auto;
  top: 120px;
  left: 360px;
  z-index: 3;
  background-color: white;
`;

const TextAlignDiv = styled.div`
  font-size: 20px;
  display: flex;
  justify-content: center;
  margin: 5px 0;
`;

const IconDiv = styled.div`
  margin: 0 5px;
  padding: 5px;
  cursor: pointer;
  font-size: 20px;
`;

const TextStyleDiv = styled.div`
  font-size: 20px;
  display: flex;
  justify-content: center;
`;

export default function TextEditor({ innerRef, handleCanvasOn }) {
  // const dispatch = useDispatch();
  const activeObj = useSelector((state) => state.activeObj);
  const activeCanvas = useSelector((state) => state.activeCanvas);

  const [textEditorDisplay, setTextEditorDisplay] = useState("none");
  const [style, setStyle] = useState({
    fill: "", //fontColor
    textAlign: "",
    fontSize: "",
    lineHeight: "",
    fontWeight: "",
    fontStyle: "",
    underline: "",
  });

  function handleFontStyleChange(e, key) {
    // e.preventDefault();
    let fontStyle = { ...style };
    if (key === "fill") {
      fontStyle[key] = e.hex;
    } else if (key === "textAlign") {
      fontStyle[key] = e;
    } else if (["fontWeight", "fontStyle"].includes(key)) {
      fontStyle[key] = fontStyle[key] !== "normal" ? "normal" : e;
    } else if (key === "underline") {
      fontStyle[key] = fontStyle[key] ? false : true;
    } else {
      fontStyle[key] = e.target.value;
    }
    activeObj.set(fontStyle);
    activeCanvas.renderAll();
    setStyle(fontStyle);
    // dispatch({
    //   type: "SET_ACTIVE_OBJ",
    //   payload: activeObj
    // });
    handleCanvasOn(activeCanvas);
  }

  useEffect(() => {
    let display = "none";
    if (Object.keys(activeObj).length) {
      console.log(activeObj, activeObj["fontWeight"]);
      setStyle(
        Object.keys(style).reduce((acc, fontStyle) => {
          acc[fontStyle] = activeObj[fontStyle];
          return acc;
        }, {})
      );
      if (activeObj.get("type") === "i-text") {
        display = "block";
      }
    }
    setTextEditorDisplay(display);
  }, [activeObj]);

  return (
    <TextEditorDiv ref={innerRef} style={{ display: textEditorDisplay }}>
      <CompactPicker
        color={style.fill}
        onChange={(e) => handleFontStyleChange(e, "fill")}
        style={{ margin: "5px" }}
      />
      <TextAlignDiv>
        <IconDiv
          onClick={() => handleFontStyleChange("left", "textAlign")}
          style={{
            outline: style.textAlign === "left" ? "1px black solid" : "none",
          }}
        >
          <i className="fas fa-align-left" />
        </IconDiv>
        <IconDiv
          onClick={() => handleFontStyleChange("center", "textAlign")}
          style={{
            outline: style.textAlign === "center" ? "1px black solid" : "none",
          }}
        >
          <i className="fas fa-align-center" />
        </IconDiv>
        <IconDiv
          onClick={() => handleFontStyleChange("right", "textAlign")}
          style={{
            outline: style.textAlign === "right" ? "1px black solid" : "none",
          }}
        >
          <i className="fas fa-align-right" />
        </IconDiv>
      </TextAlignDiv>
      <div>
        <label>Font size:</label>
        <input
          type="range"
          value={style.fontSize}
          min="1"
          max="120"
          step="1"
          id="text-font-size"
          name="text-font-size"
          onChange={(e) => handleFontStyleChange(e, "fontSize")}
        />
      </div>
      <div>
        <label>Line height:</label>
        <input
          type="range"
          value={style.lineHeight}
          min="0.5"
          max="2"
          step="0.1"
          id="text-line-height"
          onChange={(e) => handleFontStyleChange(e, "lineHeight")}
        />
      </div>
      <TextStyleDiv>
        <IconDiv
          onClick={() => handleFontStyleChange("bold", "fontWeight")}
          style={{
            backgroundColor: style.fontWeight === "bold" ? "#D0D0D0" : "white",
          }}
        >
          <i className="fas fa-bold" />
        </IconDiv>
        <IconDiv
          onClick={() => handleFontStyleChange("italic", "fontStyle")}
          style={{
            backgroundColor:
              style.fontWeight === "italic" ? "#D0D0D0" : "white",
          }}
        >
          <i className="fas fa-italic" />
        </IconDiv>
        <IconDiv
          onClick={() => handleFontStyleChange("true", "underline")}
          style={{ backgroundColor: style.underline ? "#D0D0D0" : "white" }}
        >
          <i className="fas fa-underline" />
        </IconDiv>
      </TextStyleDiv>
    </TextEditorDiv>
  );
}
