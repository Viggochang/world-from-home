import { React, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { fabric } from "fabric";

const ImageEditorDiv = styled.div`
  width: 245px;
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
  @media (max-width: 1200px) {
    margin-left: 20px;
  }
`;

const ImageSizeDiv = styled.div`
  padding-bottom: 15px;
  border-bottom: 1px solid rgb(184, 195, 208, 0.7);
`;

const Title = styled.div`
  color: rgb(58, 74, 88, 0.6);
  font-size: 18px;
  font-weight: bold;
  width: 100%;
  margin-bottom: 10px;
`;

const BtnDiv = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  justify-content: center;
`;
const SizeBtn = styled.div`
  width: 20px;
  height: 20px;
  padding: 5px;
  border-radius: 5px;
  background-color: rgb(184, 195, 208, 0.5);
  color: #3a4a58;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 4px;
  cursor: pointer;
  border: 4px rgb(184, 195, 208, 1) solid;
  :active {
    background-color: rgb(184, 195, 208, 0.7);
  }
`;

const FilterBtn = styled.div`
  width: 94px;
  display: flex;
  justify-content: center;
  border-radius: 6px;
  padding: 5px;
  margin: 0 4px 4px;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  border: 4px rgb(184, 195, 208, 1) solid;
  background-color: ${(props) =>
    props.active ? "rgb(58, 74, 88, 0.9)" : "rgb(184, 195, 208, 0.5)"};
  color: ${(props) => (props.active === "true" ? "white" : "#3a4a58")};
`;

export default function ImageEditor({ imageEditorRef, handleCanvasOn }) {
  const activeObj = useSelector((state) => state.activeObj);
  const activeCanvas = useSelector((state) => state.activeCanvas);

  const [imgStyle, setImgStyle] = useState({
    width: 0,
    height: 0,
    scaleX: 0,
    scaleY: 0,
  });
  const [imgFilters, setImgFilters] = useState([]);

  const allFilters = {
    Grayscale: new fabric.Image.filters.Grayscale(),
    Invert: new fabric.Image.filters.Invert(),
    Sepia: new fabric.Image.filters.Sepia(),
    "Black/White": new fabric.Image.filters.BlackWhite(),
    Brownie: new fabric.Image.filters.Brownie(),
    Vintage: new fabric.Image.filters.Vintage(),
    Technicolor: new fabric.Image.filters.Technicolor(),
    Polaroid: new fabric.Image.filters.Polaroid(),
  };

  useEffect(() => {
    if (
      activeObj &&
      Object.keys(activeObj).length &&
      activeObj.get("type") === "image"
    ) {
      setImgFilters(activeObj["filters"].map((filter) => filter.type));
      setImgStyle(
        Object.keys(imgStyle).reduce((acc, imgStyle) => {
          acc[imgStyle] = activeObj[imgStyle];
          return acc;
        }, {})
      );
      imageEditorRef.current.style.zIndex = 3;
    } else {
      imageEditorRef.current.style.zIndex = -1;
    }
  }, [activeObj]);

  function handleImgStyle(event, value, key) {
    let activeImgStyle = { ...imgStyle };
    switch (key) {
      case "size":
        const scale = 20 / Math.min(imgStyle.width, imgStyle.height);
        if (value === "minus") {
          activeImgStyle["scaleX"] = imgStyle.scaleX - scale;
          activeImgStyle["scaleY"] = imgStyle.scaleY - scale;
        } else if (value === "plus") {
          activeImgStyle["scaleX"] = imgStyle.scaleX + scale;
          activeImgStyle["scaleY"] = imgStyle.scaleY + scale;
        }
        activeObj.set(activeImgStyle);
        setImgStyle(activeImgStyle);
        break;
      case "filter":
        if (!imgFilters.includes(value)) {
          setImgFilters((filters) => [...filters, value]);
          activeObj.filters.push(allFilters[value]);
          event.target.style.backgroundColor = "rgb(58, 74, 88, 0.9)";
          event.target.style.color = "white";
        } else {
          const index = imgFilters.indexOf(value);
          setImgFilters((filters) => [
            ...filters.slice(0, index),
            ...filters.slice(index + 1),
          ]);
          activeObj.filters.splice(index, 1);
          event.target.style.backgroundColor = "rgb(184, 195, 208, 0.5)";
          event.target.style.color = "#3a4a58";
        }
        activeObj.applyFilters();
        break;
      default:
        break;
    }
    activeCanvas.renderAll();
    handleCanvasOn(activeCanvas);
  }

  return (
    <ImageEditorDiv ref={imageEditorRef}>
      <ImageSizeDiv>
        <Title>Image Size</Title>
        <BtnDiv>
          <SizeBtn onClick={(e) => handleImgStyle(e, "minus", "size")}>
            <i className="fas fa-minus" />
          </SizeBtn>
          <SizeBtn onClick={(e) => handleImgStyle(e, "plus", "size")}>
            <i className="fas fa-plus" />
          </SizeBtn>
        </BtnDiv>
      </ImageSizeDiv>
      <ImageSizeDiv>
        <Title>Image Filters</Title>
        <BtnDiv>
          {Object.keys(allFilters).map((filter) => (
            <FilterBtn
              key={filter}
              onClick={(e) => handleImgStyle(e, filter, "filter")}
              active={imgFilters.includes(filter).toString()}
              style={{
                backgroundColor: imgFilters.includes(filter)
                  ? "rgb(58, 74, 88, 0.9)"
                  : "rgb(184, 195, 208, 0.5)",
                color: imgFilters.includes(filter) ? "white" : "#3a4a58",
              }}
            >
              {filter}
            </FilterBtn>
          ))}
        </BtnDiv>
      </ImageSizeDiv>
    </ImageEditorDiv>
  );
}
