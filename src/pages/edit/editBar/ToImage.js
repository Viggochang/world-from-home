import React from "react";
import styled from "styled-components";
import Compressor from "compressorjs";

import { useSelector } from "react-redux";

import { storage } from "../../../util/firebase";

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

function dataURItoBlob(dataURI) {
  // convert base64/URLEncoded data component to raw binary data held in a string
  let byteString;
  if (dataURI.split(",")[0].indexOf("base64") >= 0)
    byteString = atob(dataURI.split(",")[1]);
  else byteString = unescape(dataURI.split(",")[1]);

  // separate out the mime component
  let mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // write the bytes of the string to a typed array
  let ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], { type: mimeString });
}

export default function ToImage({ allCanvas }) {
  const userInfo = useSelector((state) => state.userInfo);
  const albumIdEditing = useSelector((state) => state.albumIdEditing);
  const myUserId = userInfo.id;

  function handleUploadImg(img, canvasId, callback) {
    new Compressor(img, {
      quality: 0.6,
      maxWidth: 2048,
      maxHeight: 2048,
      success(result) {
        // Send the compressed image file to server with XMLHttpRequest.
        const metadata = { contentType: result.type };
        const storageRef = storage.ref(`user_album/${albumIdEditing}`);
        storageRef.put(result, metadata).then(() => {
          storageRef.getDownloadURL().then((imageUrl) => {
            callback(imageUrl);
          });
        });
      },
      error(err) {
        console.log(err.message);
      },
    });
  }

  async function handleToImage() {
    const body = {};
    await Object.entries(allCanvas).forEach(([canvasId, canvasEl], index) => {
      console.log(index, canvasId, canvasEl);
      console.log(canvasEl.toDataURL());

      // handleUploadImg(
      //   dataURItoBlob(canvasEl.toDataURL()),
      //   canvasId,
      //   (imgUrl) => {
      //     body[canvasId] = imgUrl;
      //   }
      // );
    });
    console.log(body);
    // htmlToImage.toPng(e.target).then((dataUrl) => {
    //   // saveAs(dataUrl, "my-node.png");
    //   console.log(dataUrl);
    // });
  }

  return <ToImageDiv onClick={handleToImage}>to img</ToImageDiv>;
}
