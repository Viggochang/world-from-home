import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";

import MoreInfo from "./MoreInfo";

import { MoreInformationBtn } from "../../../../../util/muiButton";

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
      <MoreInformationBtn
        showMoreInfo={showMoreInfo}
        onClick={handleMoreInfo}
      />
      <MoreInfo
        innerRef={moreInfoRef}
        handleMoreInfo={handleMoreInfo}
        userInfo={myInfo}
      ></MoreInfo>
    </div>
  );
}
