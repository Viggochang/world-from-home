import React from "react";
import styled from "styled-components";
import * as htmlToImage from "html-to-image";

const ToImageDiv = styled.div`
  width: 64px;
  height: 64px;
  background-color: white;
  cursor: pointer;
`;

const saveAs = (blob, fileName) => {
  var elem = window.document.createElement("a");
  elem.href = blob;
  elem.download = fileName;
  elem.style = "display:none;";
  (document.body || document.documentElement).appendChild(elem);
  if (typeof elem.click === "function") {
    elem.click();
  } else {
    elem.target = "_blank";
    elem.dispatchEvent(
      new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
      })
    );
  }
  URL.revokeObjectURL(elem.href);
  elem.remove();
};

export default function ToImage({ allCanvas }) {
  function handleToImage() {
    Object.values(allCanvas).forEach((canvasEl, index) => {
      console.log(index, canvasEl);
      // console.log(canvasEl.toDataURL());
      // canvasEl.get(0).toBlob(function (blob) {
      //   saveAs(blob, `myIMG_${index}.png`);
      // });
    });
    // htmlToImage.toPng(e.target).then((dataUrl) => {
    //   // saveAs(dataUrl, "my-node.png");
    //   console.log(dataUrl);
    // });
  }

  return <ToImageDiv onClick={handleToImage}>to img</ToImageDiv>;
}
