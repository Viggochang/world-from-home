import React, {useEffect, useState} from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import CountryShape from './component/CountryShape';
import CountryClock from "./component/CountryClock";
import Weather from './component/Weather';
import GalleryInCountry from "./component/GalleryInCountry";

const CountryDiv = styled.div`
  width: calc(90% - 160px);
  height: calc(90% - 160px);
  padding: 60px 60px 30px;
  /* background-color: rgba(63, 63, 63, 1); */
  position: fixed;
  top: 5%;
  left: 5%;
  z-index: 2;
  transition: background-color 0.5s, visibility 0.5s, opacity 0.5s;
  transition-delay: 1s;
  justify-content: space-between;
  flex-wrap: wrap;
`;

// const FrameDiv = styled.div`
//   width: 35%;
//   height: 57%;
//   border: 1px white solid;
//   position: relative;
// `;

const CountryInfoDiv = styled.div`
  width: calc(50% - 20px);
  height: calc(43% - 60px);
  border: 1px white solid;
  color: white;
  display: flex;
`;

const CaptainCity = styled.div`
  margin: 20px;
  font-size: 50px;
  font-weight: bold;
  color: white;
  text-align: left;
`;

const FriendsContainerDiv = styled.div`
  width: calc(50% - 20px);
  height: calc(43% - 60px);
  /* border: 1px white solid; */
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
`;

const OtherGalleryDiv = styled.div`
  width: 80%;
  height: 25%;
  margin-bottom: 10px;
  border: 1px white solid;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 30px;
  font-weight: bold;
  cursor: pointer;
`;

const TitleDiv = styled.div`
  font-size: 35px;
  color: white;
  font-weight: bold;
  padding: 10px 0;
  margin-right: auto;
`;

const MyFriends = styled.div`
  width: 100%;
  height: calc(70% - 55px);
  background-color: #e0e0e0;
  display: flex;
`;

const BackDiv = styled.div`
  width: 40px;
  height: 40px;
  position: absolute;
  top: 10px;
  right: 10px;
  color: white;
  font-weight: bold;
  font-size: 25px;
  cursor: pointer;
`;

function Country({style, back, galleryQuestionRef}) {
  const targetCountry = useSelector((state) => state.targetCountry);

  const [captain, setCaptain] = useState({});

  useEffect(() => {
    console.log(targetCountry);
    if (Object.keys(targetCountry).length){
      fetch(`https://api.worldbank.org/v2/country/${targetCountry.id}?format=json`)
        .then((res) => res.json())
        .then((res) => {
          const {capitalCity, longitude, latitude} = res[1][0];
          setCaptain({capitalCity, longitude, latitude});
        });
    }
  }, [targetCountry]);

  return (
    <CountryDiv style={style}>
      <CountryShape />
      <GalleryInCountry galleryQuestionRef={galleryQuestionRef}/>
      <CountryInfoDiv>
        <CaptainCity><i className="fas fa-archway">&emsp;{captain.capitalCity}</i> </CaptainCity>
        <CountryClock captain={captain}/>
        {/* <Weather/> */}
      </CountryInfoDiv>
      <FriendsContainerDiv>
        <OtherGalleryDiv>{`${targetCountry.name} from Others`}</OtherGalleryDiv>
        <TitleDiv>{`Friends in ${targetCountry.name}`}</TitleDiv>
        <MyFriends>my friends</MyFriends>
      </FriendsContainerDiv>
      <BackDiv onClick={back}>Ｘ</BackDiv>
    </CountryDiv>
  );
}

export default Country;
