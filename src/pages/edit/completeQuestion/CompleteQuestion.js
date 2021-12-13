import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Compressor from "compressorjs";

import {
  db_tourist_spot,
  storage,
  getAlbumDataById,
  getTouristSpotByAlbumId,
  updateUser,
  updateAlbum,
  updateTouristSpot,
  setTouristSpotDataIntoDb,
  deleteTouristSpot,
} from "../../../util/firebase";
import { AlbumQuestionBtn } from "../../../util/muiButton";

import LeafletMap from "./CompleteQuestion_leaflet";

import { discardCanvasEdit } from "../../../util/redux/action";

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
  :hover {
    background-color: rgb(184, 195, 208, 0.3);
  }
`;

const CoverPhotoDiv = styled.div`
  display: flex;
`;

const CoverPhoto = styled.div`
  outline: 1px rgb(255, 255, 255, 0.5) solid;
  width: 40vmin;
  height: 30vmin;
  box-shadow: 4px 6px 10px rgb(80, 80, 80, 0.3);
  background-color: white;
  background-image: url(${(props) => props.photo});
  background-size: cover;
  background-position: center;
`;

const InputNone = styled.input`
  display: none;
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
  height: 15vmin;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  overflow: scroll;
`;

const TouristSpotInnerDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  align-items: flex-start;
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
    if (albumIdEditing) {
      async function getCoverPhoto() {
        setImageUrl((await getAlbumDataById(albumIdEditing)).cover_photo || "");
      }
      async function getTouristSpot() {
        setTouristSpot((await getTouristSpotByAlbumId(albumIdEditing)) || []);
      }
      getCoverPhoto();
      getTouristSpot();
    }
  }, [albumIdEditing]);

  useEffect(() => {
    touristSpotRef.current.scrollTop = touristSpotRef.current.scrollHeight;
  }, [touristSpot]);

  function handleUploadImg(event) {
    const img = event.target.files[0];

    new Compressor(img, {
      quality: 1,
      maxWidth: 1024,
      success(result) {
        const metadata = { contentType: result.type };
        const storageRef = storage.ref(
          `userId/albums/${albumIdEditing}/cover_photo`
        );
        storageRef.put(result, metadata).then(() => {
          storageRef.getDownloadURL().then((imageUrl) => {
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
    deleteTouristSpot(spot.id);
  }

  function handleSubmit() {
    touristSpot.forEach((spot) => {
      if (spot.id) {
        updateTouristSpot(spot.id, { condition: "completed" });
      } else {
        const id = db_tourist_spot.doc().id;
        const body = {
          id,
          ...spot,
          album_id: albumIdEditing,
          condition: "completed",
        };
        setTouristSpotDataIntoDb(id, body);
      }
    });

    const body = {
      cover_photo: imageUrl,
      condition: "completed",
    };

    async function CompleteAlbum() {
      await updateAlbum(albumIdEditing, body);
      dispatch(discardCanvasEdit(""));
      setComplete(true);
    }
    CompleteAlbum();

    if (!myInfo.travel_country.includes(targetCountry.id)) {
      updateUser(myInfo.id, {
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
                <i className="fas fa-map-marker-alt" />
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
                <i className="fas fa-image" />
              </QuestionIcon>
              <QuestionTitleText>Cover Photo</QuestionTitleText>
            </QuestionTitle>
            <CoverPhotoDiv>
              <CoverPhoto photo={imageUrl} />
              <label>
                <InputNone
                  type="file"
                  accept="image/*"
                  onChange={handleUploadImg}
                />
                <CameraBtn>
                  <i className="fas fa-camera" />
                </CameraBtn>
              </label>
            </CoverPhotoDiv>
            <TouristSpotDiv ref={touristSpotRef}>
              <TouristSpotInnerDiv>
                {touristSpot.map((spot, index) => (
                  <TouristSpotTag key={index}>
                    {spot.text}&ensp;
                    <RemoveTag onClick={() => removeTag(spot)}>
                      <i className="fas fa-times" />
                    </RemoveTag>
                  </TouristSpotTag>
                ))}
              </TouristSpotInnerDiv>
            </TouristSpotDiv>
          </Question>
        </Form>
        <Buttons>
          <AlbumQuestionBtn content="Back" onClick={handleCancel} />
          <AlbumQuestionBtn content="Complete" onClick={handleSubmit} />
        </Buttons>
      </CompleteQuestionContainer>
    </CompleteQuestionDiv>
  );
}
