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
    if (Object.keys(activeCanvas).length) {
      activeCanvas.discardActiveObject().renderAll();
    }

    completeQuestionRef.current.style.zIndex = 5;
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
