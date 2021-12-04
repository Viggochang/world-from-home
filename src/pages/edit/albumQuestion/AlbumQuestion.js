import React, { useRef, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import InputBase from "@mui/material/InputBase";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";

import { AlbumQuestionBtn } from "../../../util/muiButton";

import {
  getAlbumDataById,
  deleteAlbum,
  updateAlbum,
  getTouristSpotByAlbumId,
  updateTouristSpot,
} from "../../../util/firebase";
import "./albumQuestion.css";

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
  max-width: 370px;
  height: 643px;
  margin: auto;
  padding: 50px 100px 40px;
  z-index: 5;
  box-shadow: 0px 0px 5px 1px #d0d0d0;
  position: relative;
  border-radius: 8px;
`;

const Form = styled.div`
  margin-top: 20px;
  padding: 0 50px 0 30px;
  width: 88%;
  height: 411px;
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
  /* @media (min-height: 1080px) {
    margin-top: 20px;
    font-size: 36px;
    line-height: 60px;
  } */
`;

const TextAreaDiv = styled.div`
  width: 100%;
  outline: 1px rgb(58, 74, 88, 0.5) solid;
  max-height: 50%;
  font-size: 20px;
  overflow-y: scroll;
  border-radius: 10px;
  /* @media (min-height: 1080px) {
    width: 100%;
  } */
`;

const ButtonsDiv = styled.div`
  width: 100%;
  margin-top: 40px;
  display: flex;
  justify-content: space-around;
`;

const Title = styled.div`
  color: #ffffff;
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  /* @media (min-height: 1080px) {
    font-size: 48px;
  } */
`;
const TitleCountry = styled.div`
  color: #ffffff;
  font-size: ${(props) =>
    props.country && props.country.split(" ").length < 2 ? "64px" : "48px"};
  font-weight: bold;
  text-align: center;
  margin: 10px;
  /* @media (min-height: 1080px) {
    font-size: 64px;
  } */
`;

const SearchDiv = styled.div`
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
  width: 100%;
  :focus {
    outline: none;
  }
  ::placeholder {
    color: #b8c3d0;
    font-size: 20px;
  }
`;

const CountryStateApi = "https://countriesnow.space/api/v0.1/countries/states";

export default function AlbumQuestion() {
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
    if (albumIdEditing) {
      async function getTripData() {
        const albumData = await getAlbumDataById(albumIdEditing);
        if (!albumData) {
          history.push({ pathname: "notfound" });
        } else if (!albumData.country) {
          setNewAlbum(true);
        } else {
          setTripDate(
            albumData.timestamp
              ? new Date(albumData.timestamp.seconds * 1000)
              : new Date()
          );
          setTripMainCity(albumData.position || "");
          setTripIntroduction(albumData.introduction || "");
        }
      }
      getTripData();
    }
  }, [albumIdEditing]);

  useEffect(() => {
    fetch(CountryStateApi, {
      body: JSON.stringify({ country: targetCountry.name }),
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        setCityInCountry(res.data ? res.data.states : []);
      });
  }, []);

  async function handleBack() {
    dispatch({
      type: "SET_ALBUM_ID_EDITING",
      payload: "",
    });
    if (newAlbum) {
      await deleteAlbum(albumIdEditing);
    }
    history.push({ pathname: "home" });
  }

  async function handleStartEdit() {
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
        completeCanvas: {},
      };
      await updateAlbum(albumIdEditing, body);
      QuestionRef.current.style.display = "none";
    } else {
      mainCityInputRef.current.style.outline = "4px #AE0000 solid";
    }

    const touristSpots = await getTouristSpotByAlbumId(albumIdEditing);
    touristSpots.forEach((doc) =>
      updateTouristSpot(doc.id, { condition: "pending" })
    );
  }

  return (
    <GalleryQuestionDiv ref={QuestionRef}>
      <GalleryQuestionContainer>
        <Title>Start the trip in</Title>
        <TitleCountry country={targetCountry.name}>
          {targetCountry.name}
        </TitleCountry>
        <Form>
          <QuestionDiv>
            <QustionIcon>
              <i className="fas fa-calendar-alt" />
            </QustionIcon>
            <Question>
              <QuestionTitle>Date</QuestionTitle>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  maxDate={new Date()}
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
            </Question>
          </QuestionDiv>

          <QuestionDiv>
            <QustionIcon>
              <i className="fas fa-university" />
            </QustionIcon>
            <Question>
              <QuestionTitle>City/State</QuestionTitle>
              <SearchDiv ref={mainCityInputRef}>
                <i className="fas fa-search" />
                <TextFieldDiv>
                  <Inputdiv
                    list="ice-cream-flavors"
                    id="search-country"
                    name="search-country"
                    placeholder="City/State"
                    style={{
                      border: "none",
                      background: "none",
                      fontSize: "20px",
                    }}
                    value={tripMainCity}
                    onChange={(e) => {
                      setTripMainCity(e.target.value);
                    }}
                  />

                  <datalist id="ice-cream-flavors">
                    {cityInCountry.map((state) => (
                      <option key={state.name} value={state.name} />
                    ))}
                  </datalist>
                </TextFieldDiv>
              </SearchDiv>
            </Question>
          </QuestionDiv>

          <QuestionDiv>
            <QustionIcon>
              <i className="fas fa-list-ul" />
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
                      padding: "10px 10px 0",
                      backgroundColor: "rgb(255, 255, 255, 0.4)",
                      borderRadius: "10px",
                      color: "#3a4a58",
                    },
                  }}
                  size="small"
                  maxRows={textAreaHeight}
                  placeholder="Introduce the trip"
                  variant="outlined"
                  multiline
                  onChange={(e) => {
                    setTripIntroduction(e.target.value);
                  }}
                  value={tripIntroduction}
                />
              </TextAreaDiv>
            </Question>
          </QuestionDiv>
        </Form>
        <ButtonsDiv>
          <AlbumQuestionBtn content="Cancel" onClick={handleBack} />
          <AlbumQuestionBtn
            content={newAlbum ? "Start" : "Continue"}
            onClick={handleStartEdit}
          />
        </ButtonsDiv>
      </GalleryQuestionContainer>
    </GalleryQuestionDiv>
  );
}
