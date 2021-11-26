import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { ThemeProvider } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

import { moreInfoBtnTheme } from "../../../../util/muiTheme";

import MoreInfo from "./MoreInfo";

export default function MoreInformation() {
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const moreInfoRef = useRef();
  const myInfo = useSelector((state) => state.userInfo);

  function handleMoreInfo() {
    setShowMoreInfo(showMoreInfo ? false : true);
    if (!showMoreInfo) {
      moreInfoRef.current.style.display = "flex";
    } else {
      moreInfoRef.current.style.display = "none";
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
          sx={{
            width: "220px",
            fontSize: "16px",
            borderRadius: "40px",
            lineHeight: 1.4,
            fontWeight: "bold",
            color: showMoreInfo ? "white" : "#3A4A58",
            border: showMoreInfo ? "2px white solid" : "2px #3A4A58 solid",
            boxShadow: "3px 3px 10px rgb(80, 80, 80, 0.7)",
            ":hover": {
              boxShadow: "3px 3px 5px rgb(80, 80, 80, 0.7)",
              backgroundColor: showMoreInfo ? "rgb(40, 51, 61)" : "#e0e0e0",
            },
          }}
        >
          More about Me
        </Button>
      </ThemeProvider>
      <MoreInfo
        innerRef={moreInfoRef}
        handleMoreInfo={handleMoreInfo}
        userInfo={myInfo}
      ></MoreInfo>
    </div>
  );
}
