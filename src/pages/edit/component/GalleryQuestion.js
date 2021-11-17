import React, { useRef, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import InputBase from "@mui/material/InputBase";
import { ThemeProvider } from "@material-ui/core/styles";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";

import { db_gallery } from "../../../util/firebase";
import { whiteBtnTheme } from "../../../util/muiTheme";
import "./AlbumQuestion.css";

const GalleryQuestionDiv = styled.div`
  background-color: rgb(0, 0, 0, 0.7);
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 5;
  display: flex;
`;

const GalleryQuestionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  background-color: #b8c3d0;
  width: 45vmin;
  height: 75vmin;
  /* height: 57%; */
  margin: auto;
  padding: 60px 100px 40px;
  z-index: 5;
  box-shadow: 0px 0px 5px 1px #d0d0d0;
  position: relative;
`;

const Form = styled.div`
  margin-top: 20px;
  padding: 0 50px 0 30px;
  width: 88%;
  height: 50vmin;
  /* outline: 1px white solid; */
  /* box-shadow: 4px 6px 8px #5b5b5b; */
  box-shadow: 4px 6px 10px rgb(80, 80, 80, 0.4);
  border-radius: 20px;
  color: #667484;
  background-color: #ffffff;
`;

const QuestionDiv = styled.div`
  display: flex;
`;

const QustionIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #667484;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 32px 20px 0 0;
  color: white;
  font-size: 24px;
`;

const Question = styled.div`
  width: calc(100% - 80px);
  display: flex;
  flex-direction: column;
`;

const QuestionTitle = styled.div`
  margin-top: 10px;
  font-size: 28px;
  font-weight: 400;
  line-height: 40px;
  font-weight: bold;
  @media (min-height: 1080px) {
    margin-top: 20px;
    font-size: 36px;
    line-height: 60px;
  }
`;

const TextAreaDiv = styled.div`
  width: 100%;
  /* height: calc(100% - 264px); */
  outline: 1px rgb(58, 74, 88, 0.5) solid;
  max-height: 50%;
  font-size: 20px;
  overflow-y: scroll;
  border-radius: 10px;
  @media (min-height: 1080px) {
    /* height: calc(100% - 408px); */
    width: 100%;
  }
  /* margin: 50px 0; */
`;

// const TextAreaInner = styled.div`

// `;

const ButtonsDiv = styled.div`
  width: 100%;
  margin-top: 40px;
  /* margin-left: auto; */
  display: flex;
  justify-content: space-around;
`;

const Title = styled.div`
  color: #ffffff;
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  @media (min-height: 1080px) {
    font-size: 48px;
  }
`;
const TitleCountry = styled.div`
  color: #ffffff;
  font-size: 48px;
  font-weight: bold;
  text-align: center;
  margin: 10px;
  @media (min-height: 1080px) {
    font-size: 64px;
  }
`;

const SearchDiv = styled.div`
  /* width: 100%; */
  height: 31px;
  display: flex;
  align-items: center;
  outline: 1px rgb(58, 74, 88, 0.6) solid;
  padding: 10px 20px;
  border-radius: 10px;
  background-color: rgb(255, 255, 255, 0.6);
`;

const TextFieldDiv = styled.div`
  margin-left: 20px;
  align-self: center;
`;

const Inputdiv = styled.input`
  color: #3a4a58;
  width: 240px;
  :focus {
    outline: none;
  }
  ::placeholder {
    color: #b8c3d0;
    font-size: 20px;
  }
`;

export default function GalleryQuestion() {
  const history = useHistory();
  const QuestionRef = useRef();
  const mainCityInputRef = useRef();
  const textAreaRef = useRef();
  const targetCountry = useSelector((state) => state.targetCountry);
  const albumIdEditing = useSelector((state) => state.albumIdEditing);
  const [cityInCountry, setCityInCountry] = useState([]);

  const [newAlbum, setNewAlbum] = useState(false);
  const [tripDate, setTripDate] = useState(new Date());
  const [tripMainCity, setTripMainCity] = useState("");
  const [tripIntroduction, setTripIntroduction] = useState("");
  const [textAreaHeight, setTextAreaHeight] = useState(1);

  const myInfo = useSelector((state) => state.userInfo);
  const dispatch = useDispatch();

  useEffect(() => {
    setTextAreaHeight(Math.floor((textAreaRef.current.offsetHeight - 40) / 21));
  }, [textAreaRef]);

  useEffect(() => {
    console.log(albumIdEditing);
    if (albumIdEditing) {
      db_gallery
        .doc(albumIdEditing)
        .get()
        .then((doc) => {
          if (!doc.data().country) {
            setNewAlbum(true);
          } else {
            setTripDate(
              doc.data().timestamp
                ? new Date(doc.data().timestamp.seconds * 1000)
                : new Date()
            );
            setTripMainCity(doc.data().position || "");
            setTripIntroduction(doc.data().introduction || "");
          }
        });
    }
  }, [albumIdEditing]);

  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries/states", {
      body: JSON.stringify({ country: targetCountry.name }),
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        setCityInCountry(res.data ? res.data.states : []);
        console.log(res.data ? res.data.states : []);
      });
  }, []);

  function handleBack() {
    dispatch({
      type: "SET_ALBUM_ID_EDITING",
      payload: "",
    });
    db_gallery
      .doc(albumIdEditing)
      .delete()
      .then(() => {
        history.push({ pathname: "home" });
      });
    // innerRef.current.style.display = "none";
  }

  function handleStartEdit() {
    if (
      !cityInCountry.map((state) => state.name).length ||
      cityInCountry.map((state) => state.name).includes(tripMainCity)
    ) {
      let body = {
        introduction: tripIntroduction,
        timestamp: tripDate,
        position: tripMainCity,
        user_id: myInfo.id,
        country: targetCountry.id,
        praise: [],
        condition: "pending",
      };
      db_gallery
        .doc(albumIdEditing)
        .update(body)
        .then(() => {
          QuestionRef.current.style.display = "none";
        });
    } else {
      mainCityInputRef.current.style.outline = "4px #AE0000 solid";
    }

    // history.push({ pathname: "edit" });
  }

  return (
    <GalleryQuestionDiv ref={QuestionRef}>
      <GalleryQuestionContainer>
        {/* <BackDiv onClick={handleBack}>
          <i className="fas fa-times"></i>
        </BackDiv> */}
        <Title>Start the trip in</Title>
        <TitleCountry
          style={{
            fontSize:
              targetCountry.name && targetCountry.name.split(" ").length <= 2
                ? "64px"
                : "48px",
          }}
        >
          {targetCountry.name}
        </TitleCountry>
        <Form>
          <QuestionDiv>
            <QustionIcon>
              <i className="fas fa-calendar-alt"></i>
            </QustionIcon>
            <Question>
              <QuestionTitle>Date</QuestionTitle>
              {/* <ThemeProvider theme={theme}> */}
              {/* <div style={{ backgroundColor: "white" }}> */}
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={tripDate}
                  onChange={(newValue) => {
                    setTripDate(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                  inputProps={{
                    style: {
                      height: "20px",
                      color: "#3a4a58",
                      fontSize: "20px",
                    },
                  }}
                />
              </LocalizationProvider>
              {/* </div> */}
              {/* </ThemeProvider> */}
            </Question>
          </QuestionDiv>

          <QuestionDiv>
            <QustionIcon>
              <i className="fas fa-university"></i>
            </QustionIcon>
            <Question>
              <QuestionTitle>Main City</QuestionTitle>
              <SearchDiv ref={mainCityInputRef}>
                <i className="fas fa-search"></i>
                <TextFieldDiv>
                  <Inputdiv
                    list="ice-cream-flavors"
                    id="search-country"
                    name="search-country"
                    placeholder="Main City"
                    style={{
                      border: "none",
                      background: "none",
                      // color: "white",
                      fontSize: "20px",
                    }}
                    value={tripMainCity}
                    onChange={(e) => {
                      setTripMainCity(e.target.value);
                      // e.target.parentNode.parentNode.style.outline = "none";
                    }}
                  />

                  <datalist id="ice-cream-flavors">
                    {cityInCountry.map((state) => (
                      <option key={state.name} value={state.name} />
                    ))}
                  </datalist>

                  {/* <Inputdiv
                    list="country-choice"
                    id="search-country"
                    name="search-country"
                    placeholder="Main City"
                    style={{
                      border: "none",
                      background: "none",
                      color: "white",
                      fontSize: "20px",
                    }}
                    value={tripMainCity}
                    onChange={(e) => {
                      setTripMainCity(e.target.value);
                      e.target.parentNode.parentNode.style.outline = "none";
                    }}
                  />
                  <datalist id="country-choice">
                    {cityInCountry.map((state) => (
                      <option key={state.name} value={state.name} />
                    ))}
                  </datalist> */}
                </TextFieldDiv>
              </SearchDiv>
            </Question>
          </QuestionDiv>

          <QuestionDiv>
            <QustionIcon>
              <i className="fas fa-list-ul"></i>
            </QustionIcon>
            <Question>
              <QuestionTitle>Introduction</QuestionTitle>
              <TextAreaDiv ref={textAreaRef}>
                <InputBase
                  style={{ width: "100%", padding: 0 }}
                  inputProps={{
                    style: {
                      width: "100%",
                      height: "200px",
                      fontSize: 16,
                      // border: "1px rgb(58, 74, 88, 0.5) solid",
                      padding: "10px 10px 0",
                      backgroundColor: "rgb(255, 255, 255, 0.4)",
                      borderRadius: "10px",
                      color: "#3a4a58",
                    },
                  }}
                  // label={`Edit ${title}`}
                  size="small"
                  maxRows={textAreaHeight}
                  placeholder="Introduce the trip"
                  variant="outlined"
                  multiline
                  onChange={(e) => {
                    setTripIntroduction(e.target.value);
                    console.log(textAreaRef.current.offsetHeight);
                  }}
                  value={tripIntroduction}
                />
              </TextAreaDiv>
            </Question>
          </QuestionDiv>
        </Form>
        <ThemeProvider theme={whiteBtnTheme}>
          <ButtonsDiv>
            {newAlbum ? (
              <Button
                variant="contained"
                color="white"
                sx={{
                  width: "180px",
                  fontSize: "20px",
                  fontWeight: "bold",
                  borderRadius: "40px",
                  lineHeight: 1.5,
                  margin: "0 20px",
                  color: "#667484",
                  // outline: "3px #3A4A58 solid",
                  boxShadow: "4px 6px 10px rgb(80, 80, 80, 0.4)",
                  ":hover": {
                    backgroundColor: "rgb(255, 255, 255, 0.8)",
                  },
                }}
                onClick={handleBack}
              >
                Cancel
              </Button>
            ) : (
              <></>
            )}

            <Button
              variant="contained"
              color="white"
              sx={{
                width: "180px",
                fontSize: "20px",
                fontWeight: "bold",
                borderRadius: "40px",
                lineHeight: 1.5,
                margin: "0 20px",
                color: "#667484",
                // outline: "3px #3A4A58 solid",
                boxShadow: "4px 6px 10px rgb(80, 80, 80, 0.6)",
                ":hover": {
                  backgroundColor: "rgb(255, 255, 255, 0.8)",
                },
              }}
              onClick={handleStartEdit}
            >
              {newAlbum ? "Start" : "Continue"}&ensp;
              <i className="fas fa-arrow-right"></i>
            </Button>
          </ButtonsDiv>
        </ThemeProvider>
      </GalleryQuestionContainer>
    </GalleryQuestionDiv>
  );
}
