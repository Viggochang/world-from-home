import { fabric } from "fabric";
import { useSelector, useDispatch } from "react-redux";

import { storage } from "../../../../../util/firebase";
import Compressor from "compressorjs";

import styled from "styled-components";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import Tooltip from "@mui/material/Tooltip";

import deleteIcon from "../../../../../image/deleteIcon/delete_icon.png";

let deleteIconImg = document.createElement("img");
deleteIconImg.src = deleteIcon;

const UploadImgDiv = styled.div`
  display: flex;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: -1;
  top: 52px;
  right: 10px;
  padding: 5px;
  color: #3a4a58;
  line-height: 1;
  background-color: rgb(255, 255, 255, 0.3);
  :hover {
    background-color: rgb(255, 255, 255, 0.6);
  }
`;

const ImgInputLabel = styled.label`
  font-size: 20px;
  cursor: pointer;
`;

export default function UploadImage({
  page,
  id,
  uploadImageRef,
  handleCanvasOn,
  loadingRef,
}) {
  const albumIdEditing = useSelector((state) => state.albumIdEditing);
  const canvas = useSelector((state) => state.canvas);
  const canvasState = useSelector((state) => state.canvasState);
  const editUndo = useSelector((state) => state.editUndo);
  const activeCanvas = useSelector((state) => state.activeCanvas);
  const myUserId = useSelector((state) => state.myUserId);
  const dispatch = useDispatch();

  function deleteObject(eventData, transform) {
    var target = transform.target;
    var canvas = target.canvas;
    canvas.remove(target);
    canvas.requestRenderAll();
    handleCanvasOn(activeCanvas);
  }

  function renderIcon(ctx, left, top, styleOverride, fabricObject) {
    var size = this.cornerSize;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.drawImage(deleteIconImg, -size / 2, -size / 2, 1.3 * size, size);
    ctx.restore();
  }

  fabric.Image.prototype.controls.deleteControl = new fabric.Control({
    x: 0.5,
    y: -0.49,
    offsetY: 16,
    cursorStyle: "pointer",
    mouseUpHandler: deleteObject,
    render: renderIcon,
    cornerSize: 24,
  });

  const addImg = (e, url, canvi) => {
    e.preventDefault();

    if (Object.keys(activeCanvas).length) {
      activeCanvas.discardActiveObject().renderAll();
    }
    fabric.util.loadImage(
      url,
      function (img) {
        loadingRef.style.zIndex = -1;
        var imgObj = new fabric.Image(img);
        const scale = Math.max(
          ...[canvi.height / imgObj.height, canvi.width / imgObj.width]
        );
        imgObj.set({
          scaleX: scale,
          scaleY: scale,
        });
        imgObj.setControlsVisibility({
          mt: false,
          mb: false,
          ml: false,
          mr: false,
        });
        canvi.add(imgObj);
        canvi.setActiveObject(imgObj);
        canvi.sendToBack(imgObj);
        canvi.renderAll();

        const record = {};
        record[canvi.lowerCanvasEl.id] = canvasState[canvi.lowerCanvasEl.id];
        const stateChange = {};
        stateChange[canvi.lowerCanvasEl.id] = JSON.stringify(canvi.toJSON());

        dispatch({
          type: "SET_ACTIVE_CANVAS",
          payload: canvi,
        });

        dispatch({
          type: "UNDO",
          payload: [...editUndo, record],
        });
        dispatch({
          type: "SET_CANVAS_STATE",
          payload: stateChange,
        });
        dispatch({
          type: "SET_ACTIVE_OBJ",
          payload: canvi.getActiveObject(),
        });
      },
      null,
      { crossOrigin: "anonymous" }
    );
  };

  function handleUploadImg(event, canvasId) {
    const img = event.target.files[0];
    loadingRef.style.zIndex = 1;

    new Compressor(img, {
      quality: 0.6,
      maxWidth: 2048,
      maxHeight: 2048,
      success(result) {
        // Send the compressed image file to server with XMLHttpRequest.
        const metadata = { contentType: result.type };
        const storageRef = storage.ref(
          `user_album/${myUserId}/albums/${albumIdEditing}/${canvasId}_${Date.now()}`
        );
        storageRef.put(result, metadata).then(() => {
          storageRef.getDownloadURL().then((imageUrl) => {
            addImg(event, imageUrl, canvas[canvasId]);
          });
        });
      },
      error(err) {
        console.log(err.message);
      },
    });
  }

  return (
    <Tooltip title="new image" placement="left">
      <UploadImgDiv
        ref={(el) => {
          uploadImageRef.current[`page${page}-canvas${id}`] = el;
        }}
      >
        <ImgInputLabel>
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handleUploadImg(e, `page${page}-canvas${id}`)}
          />
          <InsertPhotoIcon />
        </ImgInputLabel>
      </UploadImgDiv>
    </Tooltip>
  );
}
