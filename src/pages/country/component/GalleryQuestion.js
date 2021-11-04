import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";

import LeafletMap from "./LeafletMap";

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
    white: {
      main: "#ffffff",
    },
  },
});

const GalleryQuestionDiv = styled.div`
  display: none;
`;

const Mask = styled.div`
  background-color: rgb(0, 0, 0, 0.6);
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 2;
`;

const GalleryQuestionContainer = styled.div`
  display: flex;
  background-color: #667484;
  width: calc(90% - 160px);
  height: calc(90% - 160px);
  /* height: 57%; */
  padding: 60px 60px 40px;
  position: fixed;
  top: 5%;
  left: 5%;
  z-index: 2;
  justify-content: space-between;
  box-shadow: 0px 0px 10px #4f4f4f;
`;

const QuestionMapDiv = styled.div`
  /* outline: 1px solid white; */
  width: 50%;
  height: 100%;
`;

const QuestionTitle = styled.div`
  color: white;
  font-size: 42px;
  line-height: 60px;
`;

const QuestionDescriptionDiv = styled.div`
  /* outline: 1px solid white; */
  width: calc(50% - 20px);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const TextAreaDiv = styled.div`
  width: 90%;
  height: calc(100% - 408px);
  max-height: 50%;
  margin: 50px 0;
  font-size: 20px;
`;

const ButtonsDiv = styled.div`
  margin-bottom: 50px;
  margin-top: auto;
  display: flex;
  justify-content: space-around;
`;

const BackDiv = styled.div`
  position: absolute;
  top: 15px;
  right: 20px;
  color: white;
  font-weight: bold;
  font-size: 25px;
  cursor: pointer;
  :hover {
    color: #b8c3d0;
  }
`;

export default function GalleryQuestion({ innerRef }) {
  const history = useHistory();

  function handleBack() {
    innerRef.current.style.display = "none";
  }

  function handleEdit() {
    history.push({ pathname: "edit" });
    // window.location = '/edit'
  }

  return (
    <GalleryQuestionDiv ref={innerRef}>
      <Mask />
      <GalleryQuestionContainer>
        <BackDiv onClick={handleBack}>
          <i className="fas fa-times"></i>
        </BackDiv>
        <QuestionMapDiv>
          <QuestionTitle>
            <i className="fas fa-suitcase-rolling"></i> Where are you traveling
          </QuestionTitle>
          {/* <LeafletMap/> */}
        </QuestionMapDiv>
        <QuestionDescriptionDiv>
          <QuestionTitle>
            <i className="fas fa-pencil-alt"></i> Say something about your trip!
          </QuestionTitle>
          <TextAreaDiv>
            <TextareaAutosize
              aria-label="empty textarea"
              placeholder=""
              resize="none"
              style={{
                width: "100%",
                height: "100%",
                padding: "15px",
                resize: "none",
              }}
            />
          </TextAreaDiv>
          <ButtonsDiv>
            <ThemeProvider theme={theme}>
              <Button
                variant="contained"
                color="white"
                style={{
                  width: "200px",
                  borderRadius: "40px",
                  lineHeight: 1.5,
                  fontSize: "24px",
                  fontWeight: "bold",
                  // marginLeft: "250px",
                }}
                onClick={handleBack}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                style={{
                  width: "200px",
                  borderRadius: "40px",
                  lineHeight: 1.5,
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
                onClick={handleEdit}
              >
                Start&ensp;<i className="fas fa-arrow-right"></i>
              </Button>
            </ThemeProvider>
          </ButtonsDiv>
        </QuestionDescriptionDiv>
      </GalleryQuestionContainer>
    </GalleryQuestionDiv>
  );
}
