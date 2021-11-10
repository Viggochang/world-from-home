// 旅遊手記layout
import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { Alert, Stack } from "@mui/material";

import { db_gallery } from "../../util/firebase";
import WorkingSpace from "./WorkingSpace";
import Preview from "./component/Preview";

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

// import ToMyPage from "../world/component/ToMyPage";
import GalleryQuestion from "./component/GalleryQuestion";
import CompleteQuestion from "./component/CompleteQuestion";

const theme = createTheme({
  status: {
    danger: "#e53e3e",
  },
  palette: {
    primary: {
      main: "#3A4A58",
      darker: "#053e85",
    },
    neutral: {
      main: "#64748B",
      contrastText: "#fff",
    },
  },
});

const AlertDiv = styled.div`
  margin: 20px calc(50% - 150px);
  position: relative;
`;

const NavBarNav = styled.nav`
  width: 100vw;
  height: 72px;
  position: fixed;
  top: 0;
  background-color: #667484;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const MyPageDiv = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  box-shadow: 0px 0px 10px #bebebe;
  outline: 3px #b8c3d0 solid;
  cursor: pointer;
`;
const MyPageIconMask = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: rgb(225, 225, 225, 0);
  :hover {
    background-color: rgb(225, 225, 225, 0.3);
  }
`;

const HomeDiv = styled.div`
  font-size: 40px;
  margin-left: 20px;
  margin-right: 20px;
  color: white;
  cursor: pointer;
  :hover {
    color: #b8c3d0;
  }
`;

const ToolBarDiv = styled.div`
  width: 72px;
  height: calc(100vh - 160px);
  background-color: #f0f0f0;
  position: fixed;
  top: 140px;
  left: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
  box-shadow: 0px 0px 10px #8e8e8e;
`;

const ToolIconDiv = styled.div`
  width: 100%;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
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
`;

const ContainerDiv = styled.div`
  width: 100vw;
  min-height: calc(100% - 56px);
  display: flex;
  /* padding: 56px 0 0 72px; */
  position: fixed;
  top: 120px;
  left: 0;
  background-color: #b8c3d0;
`;

const ToolContainerDiv = styled.div`
  width: 200px;
  height: calc(100vh - 220px);
  padding: 30px 24px 30px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f0f0f0;
  position: fixed;
  top: 140px;
  left: 110px;
  z-index: 3;
  box-shadow: 0px 0px 10px #8e8e8e;
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
  z-index: 3;
  display: flex;
  align-items: center;
  padding: 5px 0;
`;

const Country = styled.div`
  color: #3a4a58;
  font-weight: bold;
  font-size: 30px;
  margin-left: 20px;
`;

const allTemplate = {
  full: {
    name: "全版相片",
    template: [
      [1, "full_1", full_1],
      [1, "full_2", full_2],
    ],
  },
  composition: {
    name: "相片拼貼",
    template: [
      [3, "3a", template_3a],
      [4, "4a", template_4a],
      [4, "4b", template_4b],
    ],
  },
  photoText: {
    name: "圖文搭配",
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
    template: [[1, "text_1", text_1]],
  },
  slideShow: {
    name: "slide show",
    template: [],
  },
};
// let templateActive = allTemplate["full"].template;

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

  const previewBtnRef = useRef();
  const saveAlertRef = useRef();
  const deleteAlertRef = useRef();
  const completeQuestionRef = useRef();
  const history = useHistory();

  useEffect(() => {
    fetch(
      `https://api.worldbank.org/v2/country/${targetCountry.id}?format=json`
    )
      .then((res) => res.json())
      .then((res) => {
        if (res[1]) {
          setLongitude(res[1][0].longitude);
          setLatitude(res[1][0].latitude);
        }
      });
  });

  useEffect(() => {
    const albumIdEditing = new URLSearchParams(window.location.search).get(
      "album_id_edit"
    );
    const newAlbumIdEditing = db_gallery.doc().id;
    dispatch({
      type: "SET_ALBUM_ID_EDITING",
      payload: albumIdEditing || newAlbumIdEditing,
    });
    if (!albumIdEditing) {
      db_gallery
        .doc(newAlbumIdEditing)
        .set({ id: newAlbumIdEditing, condition: "pending" })
        .then(() => {
          let params = new URL(window.location).searchParams;
          params.append("album_id_edit", newAlbumIdEditing);
          history.push({ search: params.toString() });
        });
    }
  }, []);
  // const workingSpaceRef = useRef();

  useEffect(() => {
    if (complete) {
      saveAlertRef.current.style.zIndex = 5;
      setTimeout(() => {
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

    // console.log(workingSpaceRef.current.scrollHeight);
    // window.scrollTo(0, workingSpaceRef.current.scrollHeight);
  }

  function handleClickTool(key) {
    // console.log(key);
    setTemplateActive(allTemplate[key].template);
    // setToolActive(key);
  }

  function handleMyPage(e, albumId) {
    saveAlertRef.current.style.zIndex = 5;
    const body = {
      content: {
        pageInfo: JSON.stringify(pageInfo),
        canvasState: JSON.stringify(canvasState),
      },
    };
    db_gallery
      .doc(albumId)
      .update(body)
      .then(() => {
        dispatch({
          type: "DISCARD_CANVAS_EDIT",
          payload: "",
        });
        history.push({ pathname: "mypage" });
      });
  }

  function handleHome(e, albumId) {
    saveAlertRef.current.style.zIndex = 5;
    const body = {
      content: {
        pageInfo: JSON.stringify(pageInfo),
        canvasState: JSON.stringify(canvasState),
      },
    };
    db_gallery
      .doc(albumId)
      .update(body)
      .then(() => {
        dispatch({
          type: "DISCARD_CANVAS_EDIT",
          payload: "",
        });
        history.push({ pathname: "home" });
      });
  }

  function handlePreview(e, albumId) {
    // Object.keys(canvasState).forEach((canvasId) => {
    // })
    previewBtnRef.current.innerText = preview ? "PREVIEW" : "Edit";
    setPreview(!preview);

    const body = {
      content: {
        pageInfo: JSON.stringify(pageInfo),
        canvasState: JSON.stringify(canvasState),
      },
    };

    if (!preview) {
      db_gallery
        .doc(albumId)
        .update(body)
        .then(() => {
          saveAlertRef.current.style.zIndex = 5;
          setTimeout(() => {
            if (saveAlertRef.current) {
              saveAlertRef.current.style.zIndex = 0;
            }
          }, 1000);
        });
    }
  }

  function handleSave(e, albumId) {
    const body = {
      content: {
        pageInfo: JSON.stringify(pageInfo),
        canvasState: JSON.stringify(canvasState),
      },
    };
    db_gallery
      .doc(albumId)
      .update(body)
      .then(() => {
        saveAlertRef.current.style.zIndex = 5;
        setTimeout(() => {
          if (saveAlertRef.current) {
            saveAlertRef.current.style.zIndex = 0;
          }
        }, 1000);
      });
  }

  function handleComplete(e, albumId) {
    completeQuestionRef.current.style.display = "flex";
    handleSave(e, albumId);

    // const body = {
    //   content: {
    //     pageInfo: JSON.stringify(pageInfo),
    //     canvasState: JSON.stringify(canvasState),
    //   },
    // };
    // db_gallery
    //   .doc(albumId)
    //   .update(body)
    //   .then(() => {
    //     dispatch({
    //       type: "DISCARD_CANVAS_EDIT",
    //       payload: "",
    //     });
    //     // history.push({ pathname: "home" });
    //     saveAlertRef.current.style.zIndex = 5;
    //     setTimeout(() => {
    //       saveAlertRef.current.style.zIndex = 0;
    //     }, 1000);
    //   });
  }

  function handleDiscard(e, albumId) {
    deleteAlertRef.current.style.zIndex = 5;
    const body = {
      condition: "discard",
    };
    db_gallery
      .doc(albumId)
      .update(body)
      .then(() => {
        dispatch({
          type: "DISCARD_CANVAS_EDIT",
          payload: "",
        });
        history.push({ pathname: "home" });
      });
  }

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
            {setComplete ? "Album Complete !" : "Album Saved !"}
          </Alert>
          <Alert
            severity="warning"
            style={{ position: "absolute", margin: 0 }}
            ref={deleteAlertRef}
          >
            Album Deleted !
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
          <i className="fas fa-home"></i>
        </HomeDiv>
      </NavBarNav>

      <ToolBarDiv>
        {Object.keys(allTemplate).map((tool) => (
          <ToolIconDiv key={tool} onClick={(e) => handleClickTool(tool)}>
            <IconDiv />
            <ToolNameDiv>{allTemplate[tool].name}</ToolNameDiv>
          </ToolIconDiv>
        ))}
      </ToolBarDiv>

      <TitleBarDiv>
        <Country>
          <i className="fas fa-globe"></i>
          &ensp;{targetCountry.name}
        </Country>
        <ThemeProvider theme={theme}>
          <Button
            variant="contained"
            color="primary"
            style={{ marginLeft: "auto", marginRight: "10px" }}
            onClick={(e) => handlePreview(e, albumIdEditing)}
            ref={previewBtnRef}
          >
            PREVIEW
          </Button>
          <Button
            variant="contained"
            color="primary"
            style={{ marginRight: "10px" }}
            onClick={(e) => handleSave(e, albumIdEditing)}
          >
            SAVE
          </Button>
          <Button
            variant="contained"
            color="primary"
            style={{ marginRight: "10px" }}
            onClick={(e) => handleComplete(e, albumIdEditing)}
          >
            COMPLETE
          </Button>
          <Button
            variant="contained"
            color="primary"
            style={{ marginRight: "10px" }}
            onClick={(e) => handleDiscard(e, albumIdEditing)}
          >
            DISCARD
          </Button>
        </ThemeProvider>
      </TitleBarDiv>

      <ContainerDiv>
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
        <WorkingSpace preview={preview} addWindow={addWindow} />
        <Preview preview={preview} />
      </ContainerDiv>
    </div>
  );
}

export default EditSpace;
