import React, { useRef } from "react";
import styled from "styled-components";

import CountryInfoPopup from "../component/countryInfo/CountryInfoPopup";
import CountryFriendPopup from "../component/countryFriend/CountryFriendPopup";

const InfoFriendDiv = styled.div`
  color: white;
  display: none;
  width: auto;
  min-width: 390px;
  height: 43%;
  flex-direction: column;
  margin: 20px 0 0 40px;

  @media (max-width: 1180px) {
    display: flex;
  }
  @media (max-width: 968px) {
    height: auto;
    width: 100%;
    flex-direction: row;
    justify-content: space-around;
    margin: 0;
  }
  @media (max-width: 600px) {
    height: auto;
    flex-direction: column;
    justify-content: flex-start;
    min-width: 0;
  }
`;

const InfoTitle = styled.div`
  width: 100%;
  font-size: 32px;
  line-height: 48px;
  border-bottom: 2px white solid;
  @media (max-width: 968px) {
    display: none;
  }
`;
const CaptainCity = styled.div`
  margin: 20px 0 0 20px;
  font-size: 40px;
  font-weight: bold;
  text-align: left;
  @media (max-width: 968px) {
    display: none;
  }
`;
const InfoFriendBtn = styled.div`
  width: 300px;
  display: none;
  outline: 1px white solid;
  font-size: 32px;
  line-height: 50px;
  border-radius: 25px;
  color: white;
  margin-top: 30px;
  justify-content: center;
  align-items: center;
  align-self: flex-start;
  @media (max-width: 1180px) {
    display: flex;
  }
  @media (max-width: 968px) {
    margin-top: 10px;
  }
  @media (max-width: 600px) {
    width: 270px;
    margin: 20px auto 0;
  }
`;

export default function InfoFriendSmall({
  captain,
  weather,
  timezone,
  friendHere,
}) {
  const infoPopupRef = useRef();
  const friendPopupRef = useRef();

  function handlePopup(popupRef) {
    popupRef.current.style.display = "flex";
  }
  return (
    <InfoFriendDiv>
      <InfoTitle>Capital City</InfoTitle>
      <CaptainCity>
        <i className="fas fa-archway"></i>
        &ensp;{captain.capitalCity}
      </CaptainCity>

      <InfoFriendBtn onClick={() => handlePopup(infoPopupRef)}>
        <i className="fas fa-info"></i>&ensp;Information
      </InfoFriendBtn>
      <InfoFriendBtn onClick={() => handlePopup(friendPopupRef)}>
        <i className="fas fa-users"></i>
        &ensp;Friends
      </InfoFriendBtn>

      <CountryInfoPopup
        captain={captain}
        popupRef={infoPopupRef}
        weatherData={weather}
        timezone={timezone}
      />
      <CountryFriendPopup popupRef={friendPopupRef} friendHere={friendHere} />
    </InfoFriendDiv>
  );
}
