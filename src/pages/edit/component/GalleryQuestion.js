import React, { useRef, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";

import { db_gallery } from "../../../util/firebase";
import "./AlbumQuestion.css";

import countryTrans from "../../../util/countryTrans";

import LeafletMap from "../../country/component/LeafletMap";
import { rgb } from "@amcharts/amcharts4/.internal/core/utils/Colors";

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
  background-color: rgb(0, 0, 0, 0.6);
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

  background-color: #667484;
  width: 45vmin;
  height: 75vmin;
  /* height: 57%; */
  margin: auto;
  padding: 60px 100px 40px;
  z-index: 5;
  box-shadow: 0px 0px 10px #d0d0d0;
  position: relative;
  color: white;
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

const QuestionMapDiv = styled.div`
  /* outline: 1px solid white; */
  width: 50%;
  height: 100%;
`;

const QuestionTitle = styled.div`
  margin-top: 20px;
  color: white;
  font-size: 36px;
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
  color: white;
  width: calc(100% - 40px);
  height: calc(100% - 408px);
  max-height: 50%;
  /* margin: 50px 0; */
  font-size: 20px;
`;

const ButtonsDiv = styled.div`
  width: 100%;
  margin-top: 40px;
  /* margin-left: auto; */
  display: flex;
  justify-content: space-around;
`;

const Title = styled.div`
  font-size: 48px;
  font-weight: bold;
  text-align: center;
`;
const TitleCountry = styled.div`
  font-size: 64px;
  font-weight: bold;
  text-align: center;
  margin: 10px;
`;

const Form = styled.div`
  margin-top: 20px;
  padding: 0 30px;
  width: 92%;
  height: 50vmin;
  outline: 1px white solid;
`;

const SearchDiv = styled.div`
  width: 280px;
  height: 31px;
  display: flex;
  align-items: center;
  padding: 10px 20px;
  border-radius: 27px;
  background-color: rgb(255, 255, 255, 0.3);
`;

const TextFieldDiv = styled.div`
  margin-left: 20px;
  align-self: center;
`;
const Inputdiv = styled.input`
  color: white;
  width: 240px;
  :focus {
    outline: none;
  }
  ::placeholder {
    color: white;
    font-size: 20px;
  }
`;

export default function GalleryQuestion() {
  const history = useHistory();
  const QuestionRef = useRef();
  const mainCityInputRef = useRef();
  const targetCountry = useSelector((state) => state.targetCountry);
  const albumIdEditing = useSelector((state) => state.albumIdEditing);
  const [cityInCountry, setCityInCountry] = useState([]);
  const [tripDate, setTripDate] = useState(new Date());
  const [tripMainCity, setTripMainCity] = useState("");
  const [tripIntroduction, setTripIntroduction] = useState("");
  const myInfo = useSelector((state) => state.userInfo);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries/states", {
      body: JSON.stringify({ country: targetCountry.name }),
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        setCityInCountry(res.data ? res.data.states : []);
      });
  }, []);

  function handleBack() {
    dispatch({
      type: "SET_ALBUM_ID_EDITING",
      payload: "",
    });
    history.push({ pathname: "home" });
    // innerRef.current.style.display = "none";
  }

  function handleStartEdit() {
    if (
      !cityInCountry.map((state) => state.name).length ||
      cityInCountry.map((state) => state.name).includes(tripMainCity)
    ) {
      let body = {
        id: albumIdEditing,
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
        .set(body)
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
          <QuestionTitle>Date</QuestionTitle>
          {/* <ThemeProvider theme={theme}> */}
          {/* <div style={{ backgroundColor: "white" }}> */}
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Trip Date"
              value={tripDate}
              onChange={(newValue) => {
                setTripDate(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
              inputProps={{
                style: {
                  height: "20px",
                  color: "white",
                  fontSize: "20px",
                },
              }}
            />
          </LocalizationProvider>
          {/* </div> */}
          {/* </ThemeProvider> */}

          <QuestionTitle>Main City</QuestionTitle>
          <SearchDiv ref={mainCityInputRef}>
            <i className="fas fa-search"></i>
            <TextFieldDiv>
              <Inputdiv
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
                onChange={(e) => {
                  setTripMainCity(e.target.value);
                  e.target.parentNode.parentNode.style.outline = "none";
                }}
              />
              <datalist id="country-choice">
                {cityInCountry.map((state) => (
                  <option key={state.name} value={state.name} />
                ))}
              </datalist>
            </TextFieldDiv>
          </SearchDiv>
          <QuestionTitle>Introduction</QuestionTitle>
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
                backgroundColor: "rgb(255, 255, 255, 0.3)",
                color: "white",
              }}
              onChange={(e) => {
                setTripIntroduction(e.target.value);
              }}
            />
          </TextAreaDiv>
        </Form>
        <ThemeProvider theme={theme}>
          <ButtonsDiv>
            <Button
              variant="contained"
              color="white"
              style={{
                width: "200px",
                borderRadius: "40px",
                lineHeight: 1.5,
                fontSize: "24px",
                fontWeight: "bold",
                color: "#3A4A58",
              }}
              onClick={handleBack}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="white"
              style={{
                width: "200px",
                borderRadius: "40px",
                lineHeight: 1.5,
                fontSize: "24px",
                fontWeight: "bold",
                color: "#3A4A58",
              }}
              onClick={handleStartEdit}
              //   () => {
              //   QuestionRef.current.style.display = "none";
              //   let body = {
              //     id: albumIdEditing,
              //     introduction: tripIntroduction,
              //     timestamp: tripDate,
              //     position: tripMainCity,
              //     user_id: myInfo.id,
              //     country: targetCountry.id,
              //     praise: [],
              //     condition: "pending",
              //   };
              //   db_gallery.doc(albumIdEditing).set(body);
              // }}
            >
              Start&ensp;<i className="fas fa-arrow-right"></i>
            </Button>
          </ButtonsDiv>
        </ThemeProvider>
      </GalleryQuestionContainer>
    </GalleryQuestionDiv>
  );
}
