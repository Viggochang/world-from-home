// to-do 相片上傳依使用者分資料夾
import { fabric } from "fabric";
import { useSelector, useDispatch } from "react-redux";

import { storage } from "../../../util/firebase";
// import 'firebase/firestore';
// import 'firebase/storage';
import Compressor from "compressorjs";

import styled from "styled-components";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import Tooltip from "@mui/material/Tooltip";

import deleteIcon from "../../../image/deleteIcon/delete_icon.png";

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
  /* width: 200px;
  height: 50px; */
  font-size: 20px;
  cursor: pointer;
`;

export default function UploadImage({
  page,
  id,
  uploadImageRef,
  handleCanvasOn,
}) {
  const albumIdEditing = useSelector((state) => state.albumIdEditing);
  const canvas = useSelector((state) => state.canvas);
  const canvasState = useSelector((state) => state.canvasState);
  const editUndo = useSelector((state) => state.editUndo);
  const activeCanvas = useSelector((state) => state.activeCanvas);
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
    // dispatch({
    //   type: "SET_ACTIVE_CANVAS",
    //   payload: canvas[id],
    // });

    // const newImg = new Image();
    // // newImg.crossOrigin = "Anonymous";
    // // const newImg = document.createElement("img");
    // // newImg.crossOrigin = "Anonymous"; // 讓圖片能讓所有人存取
    // newImg.src = url;
    // newImg.onload = () => {
    //   let imgObj = new fabric.Image(newImg);
    //   // const scale = Math.max(
    //   //   ...[canvi.height / imgObj.height, canvi.width / imgObj.width]
    //   // );

    //   fabric.util.loadImage(
    //     url,
    //     function (img) {
    //       var imgObj = new fabric.Image(img);
    //       const scale = Math.max(
    //         ...[canvi.height / imgObj.height, canvi.width / imgObj.width]
    //       );
    //       imgObj.set({
    //         scaleX: scale,
    //         scaleY: scale,
    //       });
    //       imgObj.setControlsVisibility({
    //         mt: false,
    //         mb: false,
    //         ml: false,
    //         mr: false,
    //       });
    //       canvas.add(imgObj);
    //       canvi.sendToBack(imgObj);
    //       canvas.renderAll();
    //     },
    //     { left: 0, top: 0 }
    //   );

    //   // imgObj.set({
    //   //   scaleX: scale,
    //   //   scaleY: scale,
    //   // });
    //   // imgObj.setControlsVisibility({
    //   //   mt: false,
    //   //   mb: false,
    //   //   ml: false,
    //   //   mr: false,
    //   // });
    //   // canvi.add(imgObj);
    //   // canvi.sendToBack(imgObj);
    //   // canvi.renderAll();

    //   const record = {};
    //   record[canvi.lowerCanvasEl.id] = canvasState[canvi.lowerCanvasEl.id];
    //   const stateChange = {};
    //   stateChange[canvi.lowerCanvasEl.id] = JSON.stringify(canvi.toJSON());

    //   dispatch({
    //     type: "UNDO",
    //     payload: [...editUndo, record],
    //   });
    //   dispatch({
    //     type: "SET_CANVAS_STATE",
    //     payload: stateChange,
    //   });
    //   // dispatch({
    //   //   type: "SET_ACTIVE_OBJ",
    //   //   payload: canvi.getActiveObject(),
    //   // });
    // };

    fabric.util.loadImage(
      url,
      function (img) {
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
        canvi.sendToBack(imgObj);
        canvi.renderAll();

        const record = {};
        record[canvi.lowerCanvasEl.id] = canvasState[canvi.lowerCanvasEl.id];
        const stateChange = {};
        stateChange[canvi.lowerCanvasEl.id] = JSON.stringify(canvi.toJSON());

        dispatch({
          type: "UNDO",
          payload: [...editUndo, record],
        });
        dispatch({
          type: "SET_CANVAS_STATE",
          payload: stateChange,
        });
      },
      { crossOrigin: "anonymous" }
    );
  };

  function handleUploadImg(event, canvasId) {
    const img = event.target.files[0];

    new Compressor(img, {
      quality: 0.6,
      success(result) {
        // Send the compressed image file to server with XMLHttpRequest.
        const metadata = { contentType: result.type };
        const storageRef = storage.ref(
          `userId/albums/${albumIdEditing}/${canvasId}_${Date.now()}`
        );
        storageRef.put(result, metadata).then(() => {
          storageRef.getDownloadURL().then((imageUrl) => {
            console.log(imageUrl);

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
          {/* <i className="far fa-image"></i> */}
          <InsertPhotoIcon />
        </ImgInputLabel>
      </UploadImgDiv>
    </Tooltip>
  );
}
