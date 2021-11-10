import React, { useState, useRef } from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

import { moreInfoBtnTheme } from "../../../../util/muiTheme";

import MoreInfo from "./MoreInfo";

export default function MoreInformation() {
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const moreInfoRef = useRef();

  function handleShow(ref) {
    ref.current.style.display = "flex";
  }
  function handleDisappear(ref) {
    ref.current.style.display = "none";
  }

  function handleMoreInfo() {
    setShowMoreInfo(showMoreInfo ? false : true);
    if (!showMoreInfo) {
      handleShow(moreInfoRef);
    } else {
      handleDisappear(moreInfoRef);
    }
  }

  return (
    <div>
      <ThemeProvider theme={moreInfoBtnTheme}>
        <Button
          onClick={() => {
            handleMoreInfo();
          }}
          variant="contained"
          color={showMoreInfo ? "primary" : "secondary"}
          // color={activeButton === "Friends" ? "primary" : "white"}
          style={{
            width: "220px",
            fontSize: "16px",
            borderRadius: "40px",
            lineHeight: 1.5,
            fontWeight: "bold",
            color: showMoreInfo ? "white" : "#3A4A58",
            outline: showMoreInfo ? "3px white solid" : "3px #3A4A58 solid",
          }}
        >
          More about Me
        </Button>
      </ThemeProvider>
      <MoreInfo
        innerRef={moreInfoRef}
        handleMoreInfo={handleMoreInfo}
        handleShow={handleShow}
        handleDisappear={handleDisappear}
      ></MoreInfo>
    </div>
  );
}
