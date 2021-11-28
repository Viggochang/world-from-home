// 旅遊手記layout
import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import { Alert, Stack } from "@mui/material";

import { getAlbumIsExist, updateAlbum } from "../../util/firebase";
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

  const saveAlertRef = useRef();
  const completeQuestionRef = useRef();
  const removePageRef = useRef([]);
  const canvasDivRef = useRef({});

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

      <NavBar saveAlertRef={saveAlertRef} saveEditing={saveEditing} />
      <EditBar
        preview={preview}
        setPreview={setPreview}
        canvasDivRef={canvasDivRef}
        removePageRef={removePageRef}
        saveEditing={saveEditing}
        saveAlertRef={saveAlertRef}
        completeQuestionRef={completeQuestionRef}
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
        />
      </ContainerDiv>
    </div>
  );
}

export default EditSpace;
