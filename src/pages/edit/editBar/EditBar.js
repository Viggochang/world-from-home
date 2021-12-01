import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

import { EditBtn } from "../../../util/muiButton";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  swalDiscardAlbumInEditQuestion,
  swalDiscardAlbumInEditConfirm,
  swalDiscardAlbumInEditCancel,
} from "../../../util/swal";

import {
  updateAlbum,
  getTouristSpotByAlbumId,
  updateTouristSpot,
} from "../../../util/firebase";

const TitleBarDiv = styled.div`
  width: 100vw;
  height: 38px;
  background-color: white;
  position: fixed;
  top: 72px;
  left: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  padding: 5px 0;
`;

const Country = styled.div`
  color: #3a4a58;
  font-weight: bold;
  font-size: 30px;
  margin-left: 20px;
  margin-right: auto;
`;

export default function EditBar({
  preview,
  setPreview,
  canvasDivRef,
  removePageRef,
  saveEditing,
  saveAlertRef,
  completeQuestionRef,
  allCanvasRef,
  saveCanvasToImg,
}) {
  const albumIdEditing = useSelector((state) => state.albumIdEditing);
  const targetCountry = useSelector((state) => state.targetCountry);
  const canvas = useSelector((state) => state.canvas);
  const activeCanvas = useSelector((state) => state.activeCanvas);
  const userInfo = useSelector((state) => state.userInfo);

  const dispatch = useDispatch();
  const history = useHistory();
  const previewBtnRef = useRef();

  async function handleSave(albumId) {
    if (Object.keys(activeCanvas).length) {
      activeCanvas.discardActiveObject().renderAll();
    }
    await saveEditing(albumId);
    saveAlertRef.current.style.zIndex = 5;
    setTimeout(() => {
      if (saveAlertRef.current) {
        saveAlertRef.current.style.zIndex = 0;
      }
    }, 1000);
  }

  async function handlePreview(albumId) {
    Object.values(canvas).forEach((canvas) => {
      canvas.backgroundColor = preview ? "#F0F0F0" : "white";
      canvas.renderAll();
    });
    Object.values(canvasDivRef.current).forEach(
      (el) => (el.style.boxShadow = preview ? "0px 0px 2px #8e8e8e" : "none")
    );
    removePageRef.current.forEach((el) => {
      el.style.display = preview ? "flex" : "none";
    });

    previewBtnRef.current.innerText = preview ? "PREVIEW" : "Edit";
    setPreview(!preview);

    if (!preview) {
      handleSave(albumId);
    }
  }

  function handleComplete(albumId) {
    // function dataURItoBlob(dataURI) {
    //   let byteString;
    //   if (dataURI.split(",")[0].indexOf("base64") >= 0)
    //     byteString = atob(dataURI.split(",")[1]);
    //   else byteString = unescape(dataURI.split(",")[1]);

    //   let mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

    //   let ia = new Uint8Array(byteString.length);
    //   for (let i = 0; i < byteString.length; i++) {
    //     ia[i] = byteString.charCodeAt(i);
    //   }

    //   return new Blob([ia], { type: mimeString });
    // }
    // function handleUploadImg(img, canvasId, callback) {
    //   new Compressor(img, {
    //     quality: 0.6,
    //     maxWidth: 2048,
    //     maxHeight: 2048,
    //     success(result) {
    //       // Send the compressed image file to server with XMLHttpRequest.
    //       async function putImgToStorage() {
    //         const metadata = { contentType: result.type };
    //         const storageRef = storage.ref(
    //           `user_album/${
    //             userInfo.id
    //           }/albums/${albumIdEditing}/complete_${canvasId}_${Date.now()}`
    //         );
    //         await storageRef.put(result, metadata);
    //         const imageUrl = await storageRef.getDownloadURL();
    //         callback(imageUrl);
    //         // updateCompleteCanvas(albumIdEditing, imageUrl);
    //       }
    //       putImgToStorage();
    //     },
    //     error(err) {
    //       console.log(err.message);
    //     },
    //   });
    // }

    if (Object.keys(activeCanvas).length) {
      activeCanvas.discardActiveObject().renderAll();
    }

    completeQuestionRef.current.style.zIndex = 5;

    // const body = {};
    // Object.entries(allCanvasRef.current).forEach(([canvasId, canvasEl]) => {
    //   handleUploadImg(
    //     dataURItoBlob(canvasEl.toDataURL()),
    //     canvasId,
    //     (imageUrl) => {
    //       body[canvasId] = imageUrl;
    //       updateAlbum(albumIdEditing, { completeCanvas: body });
    //     }
    //   );
    // });
    saveCanvasToImg(albumId);
    handleSave(albumId);
  }

  async function handleDiscard(albumId) {
    async function discardTouristSpot() {
      const touristSpots = await getTouristSpotByAlbumId(albumId);
      touristSpots.forEach((spot) =>
        updateTouristSpot(spot.id, { condition: "discard" })
      );
    }

    async function discardAlbumInEdit(MySwal) {
      await updateAlbum(albumId, { condition: "discard" });
      const result = await swalDiscardAlbumInEditConfirm(MySwal);
      if (result.isConfirmed) {
        dispatch({
          type: "DISCARD_CANVAS_EDIT",
          payload: "",
        });
        discardTouristSpot();
        history.push({ pathname: "home" });
      }
    }

    const MySwal = withReactContent(Swal);
    const result = await swalDiscardAlbumInEditQuestion(MySwal);
    if (result.isConfirmed) {
      discardAlbumInEdit(MySwal);
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      swalDiscardAlbumInEditCancel(MySwal);
    }
  }

  const editBtn = [
    { name: "PREVIEW", feature: handlePreview, ref: previewBtnRef },
    { name: "SAVE", feature: handleSave, ref: null },
    { name: "COMPLETE", feature: handleComplete, ref: null },
    { name: "DISCARD", feature: handleDiscard, ref: null },
  ];

  return (
    <TitleBarDiv>
      <Country>
        <i className="fas fa-globe" />
        &ensp;{targetCountry.name}
      </Country>

      {editBtn.map(({ name, feature, ref }) => (
        <EditBtn
          key={name}
          content={name}
          onClick={() => feature(albumIdEditing)}
          innerRef={ref}
        />
      ))}
    </TitleBarDiv>
  );
}
