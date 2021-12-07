import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import { Alert, Stack } from "@mui/material";
import Compressor from "compressorjs";

import { getAlbumIsExist, updateAlbum, storage } from "../../util/firebase";
import { allTemplate } from "../../util/myTemplate";

import NavBar from "./navBar/NavBar";
import EditBar from "./editBar/EditBar";
import ToolBar from "./toolBar/ToolBar";
import WorkingSpace from "./workingSpace/WorkingSpace";
import AlbumQuestion from "./albumQuestion/AlbumQuestion";
import CompleteQuestion from "./completeQuestion/CompleteQuestion";
import ToolContainer from "./toolContainer/ToolContainer";

const AlertDiv = styled.div`
  margin: 20px calc(50% - 150px);
  position: relative;
`;

const ContainerDiv = styled.div`
  width: 100vw;
  min-height: calc(100% - 56px);
  display: flex;
  position: fixed;
  top: 120px;
  left: 0;
  background-color: #b8c3d0;
  z-index: 1;
`;

const worldBankApi = (targetCountryId) =>
  `https://api.worldbank.org/v2/country/${targetCountryId}?format=json`;

function EditSpace() {
  const [templateActive, setTemplateActive] = useState(
    allTemplate["full"].template
  );
  const [preview, setPreview] = useState(false);
  const [addWindow, setAddWindow] = useState(false);
  const [complete, setComplete] = useState(false);
  const [longitude, setLongitude] = useState(121.5);
  const [latitude, setLatitude] = useState(25.04);

  const targetCountry = useSelector((state) => state.targetCountry);
  const pageInfo = useSelector((state) => state.pageInfo);
  const canvasState = useSelector((state) => state.canvasState);
  const userInfo = useSelector((state) => state.userInfo);
  const canvas = useSelector((state) => state.canvas);
  const editUndo = useSelector((state) => state.editUndo);
  const editRedo = useSelector((state) => state.editRedo);

  const saveAlertRef = useRef();
  const completeQuestionRef = useRef();
  const removePageRef = useRef([]);
  const canvasDivRef = useRef({});
  const allCanvasRef = useRef({});

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    fetch(worldBankApi(targetCountry.id))
      .then((res) => res.json())
      .then((res) => {
        if (res[1]) {
          setLongitude(res[1][0].longitude || 121.5);
          setLatitude(res[1][0].latitude || 25.04);
        }
      });
  }, []);

  useEffect(() => {
    const albumIdEditing = new URLSearchParams(window.location.search).get(
      "album_id_edit"
    );
    if (!albumIdEditing) {
      history.push({ pathname: "notfound" });
    } else {
      async function getalbumIdEditing() {
        if (await getAlbumIsExist(albumIdEditing)) {
          dispatch({
            type: "SET_ALBUM_ID_EDITING",
            payload: albumIdEditing,
          });
        } else {
          history.push({ pathname: "notfound" });
        }
      }
      getalbumIdEditing();
    }
  }, []);

  useEffect(() => {
    if (complete) {
      saveAlertRef.current.style.zIndex = 5;
      setTimeout(() => {
        setComplete(false);
        history.push({ pathname: "home" });
      }, 500);
    }
  }, [complete]);

  function saveEditing(albumId) {
    const body = {
      content: {
        pageInfo: JSON.stringify(pageInfo),
        canvasState: JSON.stringify(canvasState),
      },
    };
    return updateAlbum(albumId, body);
  }

  function saveCanvasToImg(albumId) {
    function dataURItoBlob(dataURI) {
      let byteString;
      if (dataURI.split(",")[0].indexOf("base64") >= 0)
        byteString = atob(dataURI.split(",")[1]);
      else byteString = unescape(dataURI.split(",")[1]);

      let mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

      let ia = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      return new Blob([ia], { type: mimeString });
    }

    function handleUploadImg(img, canvasId, callback) {
      return new Promise((resolve, reject) => {
        new Compressor(img, {
          quality: 1,
          maxWidth: 800,
          success(result) {
            // Send the compressed image file to server with XMLHttpRequest.
            async function putImgToStorage() {
              const metadata = { contentType: result.type };
              const storageRef = storage.ref(
                `user_album/${userInfo.id}/albums/${albumId}/complete_${canvasId}`
              );
              await storageRef.put(result, metadata);
              const imageUrl = await storageRef.getDownloadURL();
              callback(imageUrl);
            }
            putImgToStorage();
            resolve();
          },
          error(err) {
            console.log(err.message);
            reject();
          },
        });
      });
    }

    return new Promise((resolve, reject) => {
      const body = {};
      let promises = [];
      Object.entries(allCanvasRef.current).forEach(([canvasId, canvasEl]) => {
        promises.push(
          handleUploadImg(
            dataURItoBlob(canvasEl.toDataURL()),
            canvasId,
            (imageUrl) => {
              body[canvasId] = imageUrl;
              updateAlbum(albumId, { completeCanvas: body });
            }
          )
        );
      });
      Promise.all(promises).then(resolve());
    });
  }

  function handleEditHistory(action) {
    const editHistory = {
      REDO: editRedo,
      UNDO: editUndo,
    };
    if (editHistory[action].length) {
      const latestState = editHistory[action].slice(-1)[0];
      let record = {};

      if (typeof latestState === "string") {
        const pageInfoObj = {};
        pageInfoObj[latestState] = {
          ...pageInfo[latestState],
          display: pageInfo[latestState].display ? false : true,
        };
        dispatch({
          type: "SET_PAGE_INFO",
          payload: pageInfoObj,
        });
        record = latestState;
      } else {
        canvas[Object.keys(latestState)[0]].loadFromJSON(
          Object.values(latestState)[0]
        );
        const activeId = Object.keys(latestState)[0];
        record[activeId] = canvasState[activeId];

        dispatch({
          type: "SET_CANVAS_STATE",
          payload: latestState,
        });
      }

      dispatch({
        type: action,
        payload: editHistory[action].slice(0, editHistory[action].length - 1),
      });

      dispatch({
        type: action === "REDO" ? "UNDO" : "REDO",
        payload: [...editHistory[action === "REDO" ? "UNDO" : "REDO"], record],
      });
    }
  }

  return (
    <div>
      <AlbumQuestion />
      <CompleteQuestion
        completeQuestionRef={completeQuestionRef}
        longitude={longitude}
        latitude={latitude}
        setComplete={setComplete}
      />
      <AlertDiv>
        <Stack sx={{ width: "300px" }} spacing={2}>
          <Alert
            severity="success"
            style={{ position: "absolute", margin: 0 }}
            ref={saveAlertRef}
          >
            {complete ? "Album Complete !" : "Album Saved !"}
          </Alert>
        </Stack>
      </AlertDiv>

      <NavBar
        saveAlertRef={saveAlertRef}
        saveEditing={saveEditing}
        saveCanvasToImg={saveCanvasToImg}
      />
      <EditBar
        preview={preview}
        setPreview={setPreview}
        canvasDivRef={canvasDivRef}
        removePageRef={removePageRef}
        saveEditing={saveEditing}
        saveAlertRef={saveAlertRef}
        completeQuestionRef={completeQuestionRef}
        saveCanvasToImg={saveCanvasToImg}
        handleEditHistory={handleEditHistory}
      />

      <ContainerDiv>
        <ToolBar setTemplateActive={setTemplateActive} />
        <ToolContainer
          templateActive={templateActive}
          preview={preview}
          setAddWindow={setAddWindow}
        />
        <WorkingSpace
          preview={preview}
          addWindow={addWindow}
          removePageRef={removePageRef}
          canvasDivRef={canvasDivRef}
          allCanvasRef={allCanvasRef}
          handleEditHistory={handleEditHistory}
        />
      </ContainerDiv>
    </div>
  );
}

export default EditSpace;
