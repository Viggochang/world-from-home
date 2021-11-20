import { React, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { fabric } from "fabric";

const ImageEditorDiv = styled.div`
  /* outline: 1px black solid; */
  /* box-shadow: 0px 0px 15px #3a4a58; */
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
`;

const ImageSizeDiv = styled.div`
  /* width: 70%; */
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
  border-radius: 5px;
  padding: 5px;
  margin: 0 4px 4px;
  background-color: rgb(184, 195, 208, 0.5);
  color: #3a4a58;
  font-weight: bold;
  cursor: pointer;
  border: 4px rgb(184, 195, 208, 1) solid;
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

  const allFilters = [
    "Grayscale",
    "Invert",
    "Sepia",
    "Black/White",
    "Brownie",
    "Vintage",
    "Technicolor",
    "Polaroid",
  ];

  useEffect(() => {
    console.log(activeObj);
    if (Object.keys(activeObj).length && activeObj.get("type") === "image") {
      setImgStyle(
        Object.keys(imgStyle).reduce((acc, fontStyle) => {
          acc[fontStyle] = activeObj[fontStyle];
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
        break;
      case "filter":
        switch (value) {
          case "Grayscale":
            if (!imgFilters.includes(value)) {
              setImgFilters((filters) => [...filters, "Grayscale"]);
              activeObj.filters.push(new fabric.Image.filters.Grayscale());
              event.target.style.backgroundColor = "rgb(184, 195, 208, 0.7)";
            } else {
              const index = imgFilters.indexOf(value);
              setImgFilters((filters) => [
                ...filters.slice(0, index),
                ...filters.slice(index + 1),
              ]);
              activeObj.filters.splice(index, 1);
              event.target.style.backgroundColor = "rgb(184, 195, 208, 0.5)";
            }
            activeObj.applyFilters();
            break;
          default:
            break;
        }
      default:
        break;
    }

    activeCanvas.renderAll();
    setImgStyle(activeImgStyle);
    handleCanvasOn(activeCanvas);
  }

  return (
    <ImageEditorDiv ref={imageEditorRef}>
      <ImageSizeDiv>
        <Title>Image Size</Title>
        <BtnDiv>
          <SizeBtn onClick={(e) => handleImgStyle(e, "minus", "size")}>
            <i className="fas fa-minus"></i>
          </SizeBtn>
          <SizeBtn onClick={(e) => handleImgStyle(e, "plus", "size")}>
            <i className="fas fa-plus"></i>
          </SizeBtn>
        </BtnDiv>
      </ImageSizeDiv>
      <ImageSizeDiv>
        <Title>Image Filters</Title>
        <BtnDiv>
          {allFilters.map((filter) => (
            <FilterBtn onClick={(e) => handleImgStyle(e, filter, "filter")}>
              {filter}
            </FilterBtn>
          ))}
        </BtnDiv>
      </ImageSizeDiv>
    </ImageEditorDiv>
  );
}
