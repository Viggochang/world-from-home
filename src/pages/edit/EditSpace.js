// 旅遊手記layout
import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { ThemeProvider } from "@material-ui/core/styles";
import { Alert, Stack } from "@mui/material";
import { signInBtnTheme } from "../../util/muiTheme";

import {
  getAlbumIsExist,
  updateAlbum,
  getTouristSpotByAlbumId,
  updateTouristSpot,
} from "../../util/firebase";
import WorkingSpace from "./WorkingSpace";
import Logout from "../Signin/Logout";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import {
  swalDiscardAlbumInEditQuestion,
  swalDiscardAlbumInEditConfirm,
  swalDiscardAlbumInEditCancel,
} from "../../util/swal";

import icon_full from "../../image/template/icon/full.jpeg";
import icon_composition from "../../image/template/icon/composition.jpeg";
import icon_photo_text from "../../image/template/icon/photo_text.jpeg";
import icon_text from "../../image/template/icon/text.jpeg";
import icon_slide_show from "../../image/template/icon/slide_show.jpeg";

import full_1 from "../../image/template/full_1.jpeg";
import full_2 from "../../image/template/full_2.jpeg";
import template_3a from "../../image/template/template_3a.jpeg";
import template_4a from "../../image/template/template_4a.jpeg";
import template_4b from "../../image/template/template_4b.jpeg";
import photoText_1 from "../../image/template/photoText_1.jpeg";
import photoText_2 from "../../image/template/photoText_2.jpeg";
import photoText_3 from "../../image/template/photoText_3.jpeg";
import photoText_4 from "../../image/template/photoText_4.jpeg";
import photoText_5 from "../../image/template/photoText_5.jpeg";
import text_1 from "../../image/template/text_1.jpeg";
import slide_show_1 from "../../image/template/slide_show_1.jpeg";

import GalleryQuestion from "./component/GalleryQuestion";
import CompleteQuestion from "./component/CompleteQuestion";

const AlertDiv = styled.div`
  margin: 20px calc(50% - 150px);
  position: relative;
`;

const NavBarNav = styled.nav`
  font-size: 30px;
  width: 100vw;
  height: 72px;
  position: fixed;
  top: 0;
  background-color: #667484;
  z-index: 1;
  display: flex;
  align-items: center;
  color: white;
`;

const MyPageDiv = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  box-shadow: 0px 0px 10px #bebebe;
  margin-right: auto;
  margin-left: 20px;
  cursor: pointer;
`;
const MyPageIconMask = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: rgb(225, 225, 225, 0);
  :hover {
    background-color: rgb(225, 225, 225, 0.2);
  }
`;

const HomeDiv = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  margin-left: 20px;
  margin-right: 20px;
  color: white;
  cursor: pointer;
  :hover {
    background-color: rgb(255, 255, 255, 0.3);
  }
`;

const ToolBarDiv = styled.div`
  width: 72px;
  height: calc(100vh - 160px);
  background-color: rgb(255, 255, 255, 0.9);
  position: fixed;
  top: 140px;
  left: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
  box-shadow: 0px 0px 10px #8e8e8e;
  border-radius: 7px;
`;

const ToolIconDiv = styled.div`
  width: 100%;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;

const IconHover = styled.div`
  width: 42px;
  height: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  &:hover {
    background-color: rgb(184, 195, 208, 0.4);
  }
`;

const IconDiv = styled.div`
  width: 24px;
  height: 24px;
  background-color: #b8c3d0;
`;

const ToolNameDiv = styled.div`
  text-align: center;
  line-height: 18px;
  color: #667484;
  font-size: 12px;
  margin-top: -2px;
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

const ToolContainerDiv = styled.div`
  width: 200px;
  height: calc(100vh - 220px);
  padding: 30px 24px 30px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgb(255, 255, 255, 0.9);
  position: fixed;
  top: 140px;
  left: 110px;
  z-index: 1;
  box-shadow: 0px 0px 10px #8e8e8e;
  border-radius: 7px;
`;

const ToolContainerDivInner = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: scroll;
`;

const TemplateIcon = styled.img`
  width: 120px;
  margin: 20px 0;
  box-shadow: 0px 0px 10px #667484;
  cursor: pointer;
`;

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

const allTemplate = {
  full: {
    name: "全版相片",
    icon: icon_full,
    template: [
      [1, "full_1", full_1],
      [1, "full_2", full_2],
    ],
  },
  composition: {
    name: `相片拼貼`,
    icon: icon_composition,
    template: [
      [3, "3a", template_3a],
      [4, "4a", template_4a],
      [4, "4b", template_4b],
    ],
  },
  photoText: {
    name: "圖文搭配",
    icon: icon_photo_text,
    template: [
      [2, "photoText_1", photoText_1],
      [2, "photoText_2", photoText_2],
      [2, "photoText_3", photoText_3],
      [2, "photoText_4", photoText_4],
      [6, "photoText_5", photoText_5],
    ],
  },
  text: {
    name: "文字",
    icon: icon_text,
    template: [[1, "text_1", text_1]],
  },
  slideShow: {
    name: "slide show",
    icon: icon_slide_show,
    template: [[3, "slide_show_1", slide_show_1]],
  },
};
// let templateActive = allTemplate["full"].template;

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

  const editUndo = useSelector((state) => state.editUndo);

  const dispatch = useDispatch();
  const myInfo = useSelector((state) => state.userInfo);
  const targetCountry = useSelector((state) => state.targetCountry);
  const albumIdEditing = useSelector((state) => state.albumIdEditing);
  const pageInfo = useSelector((state) => state.pageInfo);
  const canvasState = useSelector((state) => state.canvasState);
  const activeCanvas = useSelector((state) => state.activeCanvas);
  const canvas = useSelector((state) => state.canvas);

  const toolIconRef = useRef([]);
  const previewBtnRef = useRef();
  const saveAlertRef = useRef();
  const completeQuestionRef = useRef();
  const removePageRef = useRef([]);
  const canvasDivRef = useRef({});
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
  });

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

  function handleMoreWindow(canvasCount, templateId) {
    if (preview === false) {
      let page = Object.keys(pageInfo).length
        ? Object.keys(pageInfo).length
        : 0;

      const pageInfoObj = {};
      pageInfoObj[`page${page}`] = {
        page,
        canvasCount,
        templateId,
        display: true,
      };

      dispatch({
        type: "SET_PAGE_INFO",
        payload: pageInfoObj,
      });
      dispatch({
        type: "UNDO",
        payload: [...editUndo, `page${page}`],
      });
      dispatch({
        type: "REDO",
        payload: [],
      });
      setAddWindow(true);
    }
  }

  function handleClickTool(key) {
    console.log(key);
    setTemplateActive(allTemplate[key].template);
  }

  function saveEditing(albumId) {
    const body = {
      content: {
        pageInfo: JSON.stringify(pageInfo),
        canvasState: JSON.stringify(canvasState),
      },
    };
    return updateAlbum(albumId, body);
  }

  async function handleMyPage(e, albumId) {
    saveAlertRef.current.style.zIndex = 5;
    await saveEditing(albumId);
    dispatch({
      type: "DISCARD_CANVAS_EDIT",
      payload: "",
    });
    history.push({ pathname: "mypage" });
  }

  async function handleHome(e, albumId) {
    saveAlertRef.current.style.zIndex = 5;
    await saveEditing(albumId);
    dispatch({
      type: "DISCARD_CANVAS_EDIT",
      payload: "",
    });
    history.push({ pathname: "home" });
  }

  async function handleSaveLogout(e, albumId, logout) {
    saveAlertRef.current.style.zIndex = 5;
    await saveEditing(albumId);
    dispatch({
      type: "DISCARD_CANVAS_EDIT",
      payload: "",
    });
    logout();
  }

  async function handleSave(e, albumId) {
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

  async function handlePreview(e, albumId) {
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
      handleSave(e, albumId);
    }
  }

  function handleComplete(e, albumId) {
    if (Object.keys(activeCanvas).length) {
      activeCanvas.discardActiveObject().renderAll();
    }
    completeQuestionRef.current.style.zIndex = 5;
    handleSave(e, albumId);
  }

  async function handleDiscard(e, albumId) {
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

  function handleHoverToolIcon(index) {
    toolIconRef.current.forEach(
      (el) => (el.style.backgroundColor = "rgb(0,0,0,0)")
    );
    toolIconRef.current[index].style.backgroundColor =
      "rgb(184, 195, 208, 0.4)";
  }

  const SignInBtnStyle = {
    boxShadow: "2px 3px 6px rgb(80, 80, 80, 0.7)",
    marginRight: "10px",
  };

  const LogoutStyle = {
    margin: "0 20px 0 0",
    width: "50px",
    height: "50px",
  };

  const featureBtn = [
    { name: "PREVIEW", feature: handlePreview },
    { name: "SAVE", feature: handleSave },
    { name: "COMPLETE", feature: handleComplete },
    { name: "DISCARD", feature: handleDiscard },
  ];

  return (
    <div>
      <GalleryQuestion />
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

      <NavBarNav>
        <MyPageDiv
          style={{
            backgroundImage: `url(${myInfo.photo})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          onClick={(e) => handleMyPage(e, albumIdEditing)}
        >
          <MyPageIconMask />
        </MyPageDiv>
        <HomeDiv onClick={(e) => handleHome(e, albumIdEditing)}>
          <i className="fas fa-home" />
        </HomeDiv>
        <Logout
          LogoutStyle={LogoutStyle}
          handleSaveLogout={handleSaveLogout}
          albumIdEditing={albumIdEditing}
        />
      </NavBarNav>

      <TitleBarDiv>
        <Country>
          <i className="fas fa-globe" />
          &ensp;{targetCountry.name}
        </Country>

        <ThemeProvider theme={signInBtnTheme}>
          <Button
            variant="contained"
            color="primary"
            sx={SignInBtnStyle}
            onClick={(e) => handlePreview(e, albumIdEditing)}
            ref={previewBtnRef}
          >
            PREVIEW
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={SignInBtnStyle}
            onClick={(e) => handleSave(e, albumIdEditing)}
          >
            SAVE
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={SignInBtnStyle}
            onClick={(e) => handleComplete(e, albumIdEditing)}
          >
            COMPLETE
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={SignInBtnStyle}
            onClick={(e) => handleDiscard(e, albumIdEditing)}
          >
            DISCARD
          </Button>
        </ThemeProvider>
      </TitleBarDiv>

      <ContainerDiv>
        <ToolBarDiv>
          {Object.keys(allTemplate).map((tool, index) => (
            <ToolIconDiv key={tool} onClick={(e) => handleClickTool(tool)}>
              <IconHover
                ref={(el) => (toolIconRef.current[index] = el)}
                onClick={() => handleHoverToolIcon(index)}
              >
                <IconDiv
                  style={{
                    backgroundImage: `url(${allTemplate[tool].icon})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                />
              </IconHover>
              <ToolNameDiv>{allTemplate[tool].name}</ToolNameDiv>
            </ToolIconDiv>
          ))}
        </ToolBarDiv>
        <ToolContainerDiv>
          <ToolContainerDivInner>
            {templateActive.map((template) => (
              <div
                onClick={() => handleMoreWindow(template[0], template[1])}
                key={template[1]}
              >
                <TemplateIcon
                  alt={`template-${template[1]}`}
                  src={template[2]}
                />
              </div>
            ))}
          </ToolContainerDivInner>
        </ToolContainerDiv>
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
