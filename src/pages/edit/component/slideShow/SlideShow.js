import React, { useEffect, useState } from "react";
import { Fade } from "react-slideshow-image";
import styled from "styled-components";

import TemplateCanvas from "../templateCanvas/TemplateCanvas";
import "./slideShow.css";

const fadeImages = [
  "https://firebasestorage.googleapis.com/v0/b/world-from-home.appspot.com/o/pexels-fabian-wiktor-994605.jpg?alt=media&token=4ef6c694-7a2b-44c5-aa1c-a28c002eea83",
  "https://firebasestorage.googleapis.com/v0/b/world-from-home.appspot.com/o/pexels-julius-silver-753626.jpg?alt=media&token=9626416d-208c-486c-bb13-f199b4223544",
  "https://firebasestorage.googleapis.com/v0/b/world-from-home.appspot.com/o/pexels-nextvoyage-490466.jpg?alt=media&token=1c6c64d5-2ead-4ca0-b29b-09a78e410636",
];

const SlideContainer = styled.div`
  height: 300px;
  /* position: relative; */
`;

const EachFadeDiv = styled.div`
  width: 800px;
  height: 300px;
  position: absolute;
  top: 0;
`;

const SlideImg = styled.div`
  background-position: center;
  background-size: cover;
  width: 100%;
  height: 300px;
`;

const ButtonDiv = styled.div`
  width: 100%;
  margin: auto 0;
  display: flex;
  justify-content: space-between;
  z-index: 2;
`;
const LeftBtn = styled.div`
  width: 31px;
  height: 36px;
  border-radius: 50%;
  color: rgb(58, 74, 88, 0.6);
  font-size: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-left: 10px;
  padding-right: 5px;
  background-color: rgb(255, 255, 255, 0.3);
  :hover {
    color: rgb(58, 74, 88, 0.8);
    background-color: rgb(255, 255, 255, 0.7);
  }
`;

const RightBtn = styled.div`
  width: 31px;
  height: 36px;
  border-radius: 50%;
  color: rgb(58, 74, 88, 0.6);
  font-size: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-right: 10px;
  padding-left: 5px;
  background-color: rgb(255, 255, 255, 0.3);
  :hover {
    color: rgb(58, 74, 88, 0.8);
    background-color: rgb(255, 255, 255, 0.7);
  }
`;

export default function SlideShow({
  canvasCount,
  canvasDivRef,
  page,
  preview,
  addTextRef,
  uploadImageRef,
  handleCanvasOn,
}) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    Object.entries(canvasDivRef.current)
      .filter((canvas) => canvas[0].includes(`page${page}`))
      .forEach((canvas) => (canvas[1].style.zIndex = 0));
    Object.entries(canvasDivRef.current)
      .filter((canvas) => canvas[0].includes(`page${page}`))
      .forEach((canvas) => (canvas[1].style.opacity = 0));
    canvasDivRef.current[`page${page}-canvas${activeSlide}`].style.zIndex = 1;
    canvasDivRef.current[`page${page}-canvas${activeSlide}`].style.opacity = 1;
    console.log("slide_show", `page${page}-canvas${activeSlide}`);
  }, [activeSlide]);

  function handleLeft() {
    setActiveSlide((activeSlide) => (activeSlide + 2) % 3);
  }
  function handleRight() {
    setActiveSlide((activeSlide) => (activeSlide + 1) % 3);
  }

  return (
    <>
      <TemplateCanvas
        slideShow={true}
        canvasCount={canvasCount}
        canvasDivRef={canvasDivRef}
        page={page}
        preview={preview}
        addTextRef={addTextRef}
        uploadImageRef={uploadImageRef}
        handleCanvasOn={handleCanvasOn}
      />
      <ButtonDiv>
        <LeftBtn onClick={handleLeft}>
          <i className="fas fa-caret-left"></i>
        </LeftBtn>
        <RightBtn onClick={handleRight}>
          <i className="fas fa-caret-right"></i>
        </RightBtn>
      </ButtonDiv>
    </>
  );
  // return (
  //   <SlideContainer className="slide-container">
  //     <Fade>
  //       {/* <TemplateCanvas
  //         canvasCount={canvasCount}
  //         canvasDivRef={canvasDivRef}
  //         page={page}
  //         preview={preview}
  //         addTextRef={addTextRef}
  //         uploadImageRef={uploadImageRef}
  //       /> */}

  //       <EachFadeDiv className="each-fade">
  //         <SlideImg style={{ backgroundColor: `rgb(0,0,0,0.3)` }} />
  //         {/* <img src={fadeImages[0]} alt="img1" /> */}
  //         {/* </SlideImg> */}
  //         {/* <p>First Slide</p> */}
  //       </EachFadeDiv>
  //       <EachFadeDiv className="each-fade">
  //         {/* <p>Second Slide</p> */}
  //         <SlideImg style={{ backgroundImage: `url(${fadeImages[1]})` }} />
  //         {/* <img src={fadeImages[1]} alt="img2" />
  //         </SlideImg> */}
  //       </EachFadeDiv>
  //       <EachFadeDiv className="each-fade">
  //         <SlideImg style={{ backgroundImage: `url(${fadeImages[2]})` }} />
  //         {/* <img src={fadeImages[2]} alt="img3" />
  //         </EachFadeDiv> */}
  //         {/* <p>Third Slide</p> */}
  //       </EachFadeDiv>
  //     </Fade>
  //   </SlideContainer>
  // );
}
