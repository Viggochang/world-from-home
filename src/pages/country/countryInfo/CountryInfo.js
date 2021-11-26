import React from "react";
import styled from "styled-components";

import Weather from "./CountryInfo_Weather";
import CountryClock from "./CountryInfo_Clock";

const CountryInfoDiv = styled.div`
  color: white;
  display: flex;
  justify-content: space-between;
`;

const LeftDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 390px;
  @media (max-width: 1180px) {
    display: none;
  }
`;

const InfoTitle = styled.div`
  width: 100%;
  font-size: 32px;
  line-height: 48px;
  border-bottom: 2px white solid;
  margin-top: 20px;
  @media (max-height: 900px) {
    font-size: 28px;
    line-height: 32px;
  }
`;

const CaptainCity = styled.div`
  margin: 20px 0 0 20px;
  font-size: 40px;
  font-weight: bold;
  text-align: left;
  @media (max-height: 900px) {
    font-size: 30px;
    margin-top: 10px;
  }
`;
const WeatherShow = styled.div`
  display: flex;
`;

const RightDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 60px;
  @media (max-width: 1280px) {
    display: none;
  }
`;

export default function CountryInfo({ captain, weather, timezone }) {
  return (
    <CountryInfoDiv>
      <LeftDiv>
        <InfoTitle>Capital City</InfoTitle>
        <CaptainCity>
          <i className="fas fa-archway" />
          &ensp;{captain.capitalCity}
        </CaptainCity>
        <InfoTitle>Weather</InfoTitle>
        <WeatherShow>
          <Weather weatherData={weather} />
        </WeatherShow>
      </LeftDiv>
      <RightDiv>
        <InfoTitle>Time</InfoTitle>
        <CountryClock timezone={timezone} />
      </RightDiv>
    </CountryInfoDiv>
  );
}
