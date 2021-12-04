import React, { useState, useRef } from "react";
import MoreInfo from "./MoreInfo";

import { MoreInformationBtn } from "../../../../../util/muiButton";

export default function MoreInformation({ userInfo }) {
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const moreInfoRef = useRef();

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
        userInfo={userInfo}
      ></MoreInfo>
    </div>
  );
}
