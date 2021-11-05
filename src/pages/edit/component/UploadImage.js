// to-do 相片上傳依使用者分資料夾
import { fabric } from "fabric";
import { useSelector, useDispatch } from "react-redux";

import { storage } from "../../../util/firebase";
// import 'firebase/firestore';
// import 'firebase/storage';
import Compressor from "compressorjs";

import styled from "styled-components";

const UploadImgDiv = styled.div`
  position: absolute;
  z-index: 1;
  top: 40px;
  right: 15px;
  padding-left: 5px;
`;

const ImgInputLabel = styled.label`
  /* width: 200px;
  height: 50px; */
  font-size: 20px;
  color: #667484;
  cursor: pointer;
`;

export default function UploadImage({ page, id }) {
  const albumIdEditing = useSelector((state) => state.albumIdEditing);
  const canvas = useSelector((state) => state.canvas);
  const canvasState = useSelector((state) => state.canvasState);
  const editUndo = useSelector((state) => state.editUndo);
  const dispatch = useDispatch();

  const addImg = (e, url, canvi) => {
    e.preventDefault();
    const newImg = new Image();
    newImg.src = url;
    newImg.onload = () => {
      let imgObj = new fabric.Image(newImg);
      const scale = Math.max(
        ...[canvi.height / imgObj.height, canvi.width / imgObj.width]
      );
      imgObj.set({
        scaleX: scale,
        scaleY: scale,
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
    };
  };

  function handleUploadImg(event, canvasId) {
    const img = event.target.files[0];

    new Compressor(img, {
      quality: 0.6,
      success(result) {
        // Send the compressed image file to server with XMLHttpRequest.
        const metadata = { contentType: result.type };
        const storageRef = storage.ref(
          `userId/albums/${albumIdEditing}/${canvasId}`
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
    <UploadImgDiv>
      <ImgInputLabel>
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => handleUploadImg(e, `page${page}-canvas${id}`)}
        />
        <i className="far fa-image"></i>
      </ImgInputLabel>
    </UploadImgDiv>
  );
}
