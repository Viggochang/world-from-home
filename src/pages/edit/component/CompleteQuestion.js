import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Compressor from "compressorjs";
import { storage } from "../../../util/firebase";
import LeafletMap from "./CompleteQuestion_leaflet";

import { db_gallery } from "../../../util/firebase";

const CompleteQuestionDiv = styled.div`
  background-color: rgb(0, 0, 0, 0.6);
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
  align-items: center;

  background-color: #667484;
  width: 100vmin;
  height: 75vmin;
  /* height: 57%; */
  margin: auto;
  padding: 30px 100px 40px;
  z-index: 5;
  box-shadow: 0px 0px 10px #d0d0d0;
  position: relative;
  color: white;
`;

const Form = styled.div`
  margin-top: 20px;
  padding: 20px 30px 70px;
  width: 100%;
  height: 60vmin;
  outline: 1px white solid;
  display: flex;
  justify-content: space-between;
  position: relative;
`;

const Question = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(50% - 10px);
`;

const QuestionTitle = styled.div`
  color: white;
  font-size: 36px;
  line-height: 60px;
`;

const CameraBtn = styled.div`
  width: 40px;
  height: 40px;
  margin-left: 30px;
  border-radius: 50%;
  background-color: #b8c3d0;
  color: #3a4a58;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  :hover {
    background-color: white;
  }
`;

const CoverPhotoDiv = styled.div`
  display: flex;
`;

const CoverPhoto = styled.div`
  /* width: calc(100% - 100px);
  height: 20vh; */
  width: 40vmin;
  height: 30vmin;
  box-shadow: 0px 0px 10px #d0d0d0;
`;

const TouristSpotMapDiv = styled.div`
  width: 100%;
  height: 100%;
  outline: 1px white solid;
  color: #3a4a58;
`;

const TouristSpotDiv = styled.div`
  padding: 10px;
  margin-top: 30px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  overflow-y: scroll;
`;

const TouristSpotTag = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #b8c3d0;
  color: #3a4a58;
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  padding: 0 10px 0 15px;
  margin: 0 10px 10px 0;
  border-radius: 12px;
  box-shadow: 0px 0px 5px #d0d0d0;
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
  position: absolute;
  right: 30px;
  bottom: 15px;
  display: flex;
  justify-content: flex-end;
`;

const SubmitBtn = styled.div`
  background-color: white;
  font-size: 24px;
  font-weight: bold;
  line-height: 36px;
  border-radius: 18px;
  padding: 0 20px;
  color: #3a4a58;
  box-shadow: 0px 0px 5px #d0d0d0;
  cursor: pointer;
  margin-left: 20px;
  :hover {
    box-shadow: 0px 0px 15px #d0d0d0;
  }
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
            setTouristSpot(doc.data().tourist_spot || []);
          }
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
  }

  function handleSubmit() {
    const body = {
      cover_photo: imageUrl,
      tourist_spot: touristSpot,
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
  }

  function handleCancel() {
    completeQuestionRef.current.style.zIndex = -1;
  }

  return (
    <CompleteQuestionDiv ref={completeQuestionRef}>
      <CompleteQuestionContainer>
        <Form>
          <Question>
            <QuestionTitle>Tourist Spots</QuestionTitle>
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
            <QuestionTitle>Cover Photo</QuestionTitle>
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
          <Buttons>
            <SubmitBtn onClick={handleCancel}>Cancel</SubmitBtn>
            <SubmitBtn onClick={handleSubmit}>Submit</SubmitBtn>
          </Buttons>
        </Form>
      </CompleteQuestionContainer>
    </CompleteQuestionDiv>
  );
}
