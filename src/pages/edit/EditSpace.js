// 旅遊手記layout
import React, { useState, useRef } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";

import {db_gallery} from '../../util/firebase';
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

const NavBarNav = styled.nav`
  width: 100%;
  height: 56px;
  position: fixed;
  top: 0;
  background-color: #667484;
  z-index: 3;
`;

const ToolBarDiv = styled.div`
  width: 72px;
  height: 100%;
  background-color: black;
  position: fixed;
  top: 56px;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
`;

const ToolIconDiv = styled.div`
  width: 100%;
  padding: 15px 0;
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
  color: #b8c3d0;
`;

const TemplateIcon = styled.img`
  width: 120px;
  margin: 20px 0;
  box-shadow: 0px 0px 10px #272727;
  cursor: pointer;
`;

const ContainerDiv = styled.div`
  width: calc(100% - 72px);
  min-height: calc(100% - 56px);
  display: flex;
  /* padding: 56px 0 0 72px; */
  position: absolute;
  top: 56px;
  left: 72px;
  background-color: #b8c3d0;
`;

const ToolContainerDiv = styled.div`
  width: 240px;
  height: 100%;
  padding: 20px 24px 0 16px;
  background-color: #3a4a58;
  position: fixed;
  z-index: 3;
`;

const TitleBarDiv = styled.div`
  width: calc(100vw - 72px);
  height: 38px;
  background-color: white;
  position: fixed;
  top: 56px;
  left: 72px;
  z-index: 3;
  display: flex;
  padding: 5px 0;
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
  text:{
    name: "文字",
    template: [[1, "text_1", text_1]]
  },
  slideShow: {
    name: "slide show",
    template: [],
  },
};
let templateActive = allTemplate["full"].template;

function EditSpace() {
  const [toolActive, setToolActive] = useState("full");
  const [preview, setPreview] = useState(false);
  const editUndo = useSelector((state) => state.editUndo);

  const dispatch = useDispatch();
  const pageInfo = useSelector((state) => state.pageInfo);
  const canvasState = useSelector((state) => state.canvasState);

  const previewBtnRef = useRef();

  // const workingSpaceRef = useRef();

  function handleMoreWindow(canvasCount, templateId) {
    let page = Object.keys(pageInfo).length ? Object.keys(pageInfo).length : 0;

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

    // console.log(workingSpaceRef.current.offsetHeight);
    // window.scrollTo(0, workingSpaceRef.current.offsetHeight);
  }

  function handleClickTool(key) {
    // console.log(key);
    templateActive = allTemplate[key].template;
    setToolActive(key);
  }

  function handlePreview(){
    // Object.keys(canvasState).forEach((canvasId) => {
    // })
    previewBtnRef.current.innerText = preview ? 'PREVIEW' : 'Edit';
    setPreview(preview ? false: true); 
  }

  function handleSave(){
    const id = db_gallery.doc().id;
    const body = {
      id, 
      timestamp: new Date(),
      content: {
        pageInfo: JSON.stringify(pageInfo),
        canvasState: JSON.stringify(canvasState)
      }
    }
    db_gallery.doc(id).set(body)
  }

  return (
    <div>
      <NavBarNav />
      <ToolBarDiv>
        {Object.keys(allTemplate).map((tool) => (
          <ToolIconDiv key={tool} onClick={(e) => handleClickTool(tool)}>
            <IconDiv />
            <ToolNameDiv>{allTemplate[tool].name}</ToolNameDiv>
          </ToolIconDiv>
        ))}
      </ToolBarDiv>
      <TitleBarDiv>
        <ThemeProvider theme={theme}>
          <Button
            variant="contained"
            color="primary"
            style={{ marginLeft: "auto", marginRight: "10px" }}
            onClick={handlePreview}
            ref={previewBtnRef}
          >
            PREVIEW
          </Button>
          <Button
            variant="contained"
            color="primary"
            style={{ marginRight: "10px" }}
            onClick={handleSave}
          >
            SAVE
          </Button>
          <Button
            variant="contained"
            color="primary"
            style={{ marginRight: "10px" }}
          >
            DISCARD
          </Button>
        </ThemeProvider>
      </TitleBarDiv>

      <ContainerDiv>
        <ToolContainerDiv>
          {templateActive.map((template) => (
            <div
              onClick={() => handleMoreWindow(template[0], template[1])}
              key={template[1]}
            >
              <TemplateIcon alt={`template-${template[1]}`} src={template[2]} />
            </div>
          ))}
        </ToolContainerDiv>
        <WorkingSpace preview={preview} />
        <Preview preview={preview}/>
      </ContainerDiv>
    </div>
  );
}

export default EditSpace;
