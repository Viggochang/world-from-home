import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import { ThemeProvider } from "@material-ui/core/styles";
import Compressor from "compressorjs";
import {
  db_tourist_spot,
  db_gallery,
  db_userInfo,
  storage,
} from "../../../util/firebase";
import LeafletMap from "./CompleteQuestion_leaflet";

import { whiteBtnTheme } from "../../../util/muiTheme";

const CompleteQuestionDiv = styled.div`
  background-color: rgb(0, 0, 0, 0.7);
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  display: flex;
`;

const CompleteQuestionContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: #b8c3d0;
  width: calc(80vmin + 240px);
  /* height: 75vmin; */
  height: calc(50vmin + 220px);
  margin: auto;
  padding: 30px 70px 30px;
  z-index: 5;
  box-shadow: 0px 0px 5px 1px #d0d0d0;
  position: relative;
  color: white;
`;

const Form = styled.div`
  margin-top: 20px;
  padding: 20px 30px 30px;
  width: calc(100% - 40px);
  /* height: 60vmin; */
  outline: 1px white solid;
  display: flex;
  justify-content: space-between;
  position: relative;
  border-radius: 10px;
  background-color: rgb(255, 255, 255, 0.95);
  box-shadow: 4px 6px 10px rgb(80, 80, 80, 0.4);
`;

const Question = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(40vmin + 70px);
  margin: 0 15px;
`;

const QuestionTitle = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const QuestionIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 20px;
  background-color: #667484;
  font-size: 20px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const QuestionTitleText = styled.div`
  color: #667484;
  font-size: 36px;
  line-height: 60px;
  font-weight: bold;
`;

const Description = styled.div`
  color: #667484;
  font-size: 18px;
  margin: -10px 0 10px 55px;
`;

const CameraBtn = styled.div`
  width: 40px;
  height: 40px;
  margin-left: 30px;
  border-radius: 50%;
  outline: 1px #b8c3d0 solid;
  color: #3a4a58;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  /* box-shadow: 0 0 15px #adadad; */
  :hover {
    background-color: rgb(184, 195, 208, 0.3);
  }
`;

const CoverPhotoDiv = styled.div`
  display: flex;
`;

const CoverPhoto = styled.div`
  /* width: calc(100% - 100px);
  height: 20vh; */
  outline: 1px rgb(255, 255, 255, 0.5) solid;
  width: 40vmin;
  height: 30vmin;
  box-shadow: 4px 6px 10px rgb(80, 80, 80, 0.3);
  background-color: white;
`;

const TouristSpotMapDiv = styled.div`
  width: 100%;
  height: 48vmin;
  outline: 1px white solid;
  color: #3a4a58;
`;

const TouristSpotDiv = styled.div`
  padding: 10px;
  margin-top: 30px;
  width: 100%;
  height: calc(100% - 350px);
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  overflow-y: scroll;
`;

const TouristSpotTag = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(184, 195, 208, 0.5);
  color: #3a4a58;
  font-weight: bold;
  font-size: 16px;
  line-height: 28px;
  padding: 0 10px 0 15px;
  margin: 0 10px 10px 0;
  border-radius: 14px;
  /* box-shadow: 0px 0px 5px #d0d0d0; */
`;

const RemoveTag = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  width: 22px;
  height: 22px;
  cursor: pointer;
  border-radius: 50%;
  :hover {
    background-color: rgb(255, 255, 255, 0.5);
  }
`;

const Buttons = styled.div`
  width: 100%;
  /* position: absolute;
  right: 30px;
  bottom: 15px; */
  display: flex;
  justify-content: flex-end;
`;

export default function CompleteQuestion({
  completeQuestionRef,
  longitude,
  latitude,
  setComplete,
}) {
  const albumIdEditing = useSelector((state) => state.albumIdEditing);
  const [imageUrl, setImageUrl] = useState("");
  const [touristSpot, setTouristSpot] = useState([]);
  const myInfo = useSelector((state) => state.userInfo);
  const targetCountry = useSelector((state) => state.targetCountry);

  const touristSpotRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(albumIdEditing);
    if (albumIdEditing) {
      db_gallery
        .doc(albumIdEditing)
        .get()
        .then((doc) => {
          if (doc.data()) {
            setImageUrl(doc.data().cover_photo || "");
          }
        });

      db_tourist_spot
        .where("album_id", "==", albumIdEditing)
        .get()
        .then((spots) => {
          setTouristSpot(spots.docs.map((spot) => spot.data() || []));
        });
    }
  }, [albumIdEditing]);

  useEffect(() => {
    console.log(touristSpotRef.current);
    touristSpotRef.current.scrollTop = touristSpotRef.current.scrollHeight;
  }, [touristSpot]);

  function handleUploadImg(event) {
    const img = event.target.files[0];

    new Compressor(img, {
      quality: 0.6,
      success(result) {
        // Send the compressed image file to server with XMLHttpRequest.
        const metadata = { contentType: result.type };
        const storageRef = storage.ref(
          `userId/albums/${albumIdEditing}/cover_photo`
        );
        storageRef.put(result, metadata).then(() => {
          storageRef.getDownloadURL().then((imageUrl) => {
            console.log(imageUrl);
            setImageUrl(imageUrl);
          });
        });
      },
      error(err) {
        console.log(err.message);
      },
    });
  }

  function removeTag(spot) {
    setTouristSpot(
      touristSpot.filter(
        (touristSpot) =>
          touristSpot.lat !== spot.lat && touristSpot.lng !== spot.lng
      )
    );
    db_tourist_spot.doc(spot.id).delete();
  }

  function handleSubmit() {
    touristSpot.forEach((spot) => {
      if (spot.id) {
        db_tourist_spot.doc(spot.id).update({ condition: "completed" });
      } else {
        const id = db_tourist_spot.doc().id;
        const body = {
          id,
          ...spot,
          album_id: albumIdEditing,
          condition: "completed",
        };
        db_tourist_spot.doc(id).set(body).then();
      }
    });

    const body = {
      cover_photo: imageUrl,
      condition: "completed",
    };
    db_gallery
      .doc(albumIdEditing)
      .update(body)
      .then(() => {
        dispatch({
          type: "DISCARD_CANVAS_EDIT",
          payload: "",
        });
        setComplete(true);
      });

    if (!myInfo.travel_country.includes(targetCountry.id)) {
      db_userInfo.doc(myInfo.id).update({
        travel_country: [...myInfo.travel_country, targetCountry.id],
      });
    }
  }

  function handleCancel() {
    completeQuestionRef.current.style.zIndex = -1;
  }

  return (
    <CompleteQuestionDiv ref={completeQuestionRef}>
      <CompleteQuestionContainer>
        <Form>
          <Question>
            <QuestionTitle>
              <QuestionIcon>
                <i className="fas fa-map-marker-alt"></i>
              </QuestionIcon>
              <QuestionTitleText>Tourist Spots</QuestionTitleText>
            </QuestionTitle>
            <Description>
              use the search box below to label tourist spots in your trip
            </Description>
            <TouristSpotMapDiv>
              <LeafletMap
                longitude={longitude}
                latitude={latitude}
                setTouristSpot={setTouristSpot}
                touristSpot={touristSpot}
              />
            </TouristSpotMapDiv>
          </Question>
          <Question>
            <QuestionTitle>
              <QuestionIcon>
                <i className="fas fa-image"></i>
              </QuestionIcon>
              <QuestionTitleText>Cover Photo</QuestionTitleText>
            </QuestionTitle>
            <CoverPhotoDiv>
              <CoverPhoto
                style={{
                  backgroundImage: `url(${imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <label>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleUploadImg}
                />
                <CameraBtn>
                  <i className="fas fa-camera"></i>
                </CameraBtn>
              </label>
            </CoverPhotoDiv>
            <TouristSpotDiv ref={touristSpotRef}>
              {touristSpot.map((spot, index) => (
                <TouristSpotTag key={index}>
                  {spot.text}&ensp;
                  <RemoveTag onClick={() => removeTag(spot)}>
                    <i className="fas fa-times"></i>
                  </RemoveTag>
                </TouristSpotTag>
              ))}
            </TouristSpotDiv>
          </Question>
        </Form>
        <ThemeProvider theme={whiteBtnTheme}>
          <Buttons>
            {/* <SubmitBtn onClick={handleCancel}>Cancel</SubmitBtn>
            <SubmitBtn onClick={handleSubmit}>Submit</SubmitBtn> */}
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
              onClick={handleCancel}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="white"
              sx={{
                width: "180px",
                fontSize: "20px",
                fontWeight: "bold",
                borderRadius: "40px",
                lineHeight: 1.5,
                marginLeft: "20px",
                color: "#667484",
                // outline: "3px #3A4A58 solid",
                boxShadow: "4px 6px 10px rgb(80, 80, 80, 0.4)",
                ":hover": {
                  backgroundColor: "rgb(255, 255, 255, 0.8)",
                },
              }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Buttons>
        </ThemeProvider>
      </CompleteQuestionContainer>
    </CompleteQuestionDiv>
  );
}
