import { React, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import { CompactPicker } from "react-color";
import TextEditorSlider from "./TextEditorSlider";

const TextEditorDiv = styled.div`
  /* outline: 1px black solid; */
  /* box-shadow: 0px 0px 15px #3a4a58; */
  box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
    rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
  padding: 10px;
  position: fixed;
  margin-left: max(calc(50% - 509px), 85px);
  top: 140px;
  left: 0px;
  z-index: 3;
  background-color: white;
  border-radius: 6px;
  border-top: 6px #3a4a58 solid;
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  color: rgb(58, 74, 88, 0.6);
  font-size: 18px;
  font-weight: bold;
  width: 100%;
  margin-bottom: 10px;
`;

const FontColorDiv = styled.div`
  /* width: 70%; */
  padding-bottom: 15px;
  border-bottom: 1px solid rgb(184, 195, 208, 0.7);
`;

const AlignStyleDiv = styled.div`
  width: 100%;
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid rgb(184, 195, 208, 0.7);
`;

const TextAlignDiv = styled.div`
  width: 120px;
  font-size: 20px;
  color: #3a4a58;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
`;

const IconDiv = styled.div`
  margin: 0 5px;
  padding: 5px;
  cursor: pointer;
  font-size: 20px;
  border-radius: 3px;
  width: 16px;
  display: flex;
  justify-content: center;
`;

const TextStyleDiv = styled.div`
  width: 110px;
  font-size: 20px;
  color: #3a4a58;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  border-left: 1px solid rgb(184, 195, 208, 0.7);
  padding-left: 13px;
`;

const FontSizeDiv = styled.div`
  padding: 10px 0;
  border-bottom: 1px solid rgb(184, 195, 208, 0.7);
`;

const LineHeightDiv = styled.div`
  padding: 10px 0;
`;

export default function TextEditor({ textEditorRef, handleCanvasOn }) {
  // const dispatch = useDispatch();
  const activeObj = useSelector((state) => state.activeObj);
  const activeCanvas = useSelector((state) => state.activeCanvas);

  const [textStyle, setTextStyle] = useState({
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
    let fontStyle = { ...textStyle };
    if (key === "fill") {
      fontStyle[key] = e.hex;
    } else if (key === "textAlign") {
      fontStyle[key] = e;
    } else if (["fontWeight", "fontStyle"].includes(key)) {
      fontStyle[key] = fontStyle[key] !== "normal" ? "normal" : e;
    } else if (key === "underline") {
      fontStyle[key] = fontStyle[key] ? false : true;
    } else if (key === "fontSize") {
      fontStyle[key] = e;
    } else {
      fontStyle[key] = e;
    }
    activeObj.set(fontStyle);
    activeCanvas.renderAll();
    setTextStyle(fontStyle);
    // dispatch({
    //   type: "SET_ACTIVE_OBJ",
    //   payload: activeObj
    // });
    handleCanvasOn(activeCanvas);
  }

  useEffect(() => {
    console.log(activeObj);
    if (
      activeObj &&
      Object.keys(activeObj).length &&
      activeObj.get("type") === "i-text"
    ) {
      setTextStyle(
        Object.keys(textStyle).reduce((acc, fontStyle) => {
          acc[fontStyle] = activeObj[fontStyle];
          return acc;
        }, {})
      );
      textEditorRef.current.style.zIndex = 3;
    } else {
      textEditorRef.current.style.zIndex = -1;
    }
  }, [activeObj]);

  return (
    <TextEditorDiv ref={textEditorRef}>
      <FontColorDiv>
        <Title>Font Color</Title>
        <CompactPicker
          color={textStyle.fill}
          onChange={(e) => handleFontStyleChange(e, "fill")}
          style={{ margin: "5px" }}
        />
      </FontColorDiv>

      <AlignStyleDiv>
        <TextAlignDiv>
          <Title>Text Align</Title>
          <IconDiv
            onClick={() => handleFontStyleChange("left", "textAlign")}
            style={{
              outline:
                textStyle.textAlign === "left" ? "1px #b8c3d0 solid" : "none",
            }}
          >
            <i className="fas fa-align-left" />
          </IconDiv>
          <IconDiv
            onClick={() => handleFontStyleChange("center", "textAlign")}
            style={{
              outline:
                textStyle.textAlign === "center" ? "1px #b8c3d0 solid" : "none",
            }}
          >
            <i className="fas fa-align-center" />
          </IconDiv>
          <IconDiv
            onClick={() => handleFontStyleChange("right", "textAlign")}
            style={{
              outline:
                textStyle.textAlign === "right" ? "1px #b8c3d0 solid" : "none",
            }}
          >
            <i className="fas fa-align-right" />
          </IconDiv>
        </TextAlignDiv>

        <TextStyleDiv>
          <Title>Font Style</Title>
          <IconDiv
            onClick={() => handleFontStyleChange("bold", "fontWeight")}
            style={{
              backgroundColor:
                textStyle.fontWeight === "bold"
                  ? "rgb(184, 195, 208, 0.3)"
                  : "white",
            }}
          >
            <i className="fas fa-bold" />
          </IconDiv>
          <IconDiv
            onClick={() => handleFontStyleChange("italic", "fontStyle")}
            style={{
              backgroundColor:
                textStyle.fontStyle === "italic"
                  ? "rgb(184, 195, 208, 0.3)"
                  : "white",
            }}
          >
            <i className="fas fa-italic" />
          </IconDiv>
          <IconDiv
            onClick={() => handleFontStyleChange("true", "underline")}
            style={{
              backgroundColor: textStyle.underline
                ? "rgb(184, 195, 208, 0.3)"
                : "white",
            }}
          >
            <i className="fas fa-underline" />
          </IconDiv>
        </TextStyleDiv>
      </AlignStyleDiv>

      <FontSizeDiv>
        <Title>Font Size</Title>
        <TextEditorSlider
          defaultVal={textStyle.fontSize}
          min={1}
          max={120}
          step={1}
          type={"fontSize"}
          handleFontStyleChange={handleFontStyleChange}
        />
      </FontSizeDiv>
      <LineHeightDiv>
        <Title>Line Height</Title>
        <TextEditorSlider
          defaultVal={textStyle.lineHeight}
          min={0.5}
          max={2}
          step={0.1}
          type={"lineHeight"}
          handleFontStyleChange={handleFontStyleChange}
        />
      </LineHeightDiv>
    </TextEditorDiv>
  );
}
