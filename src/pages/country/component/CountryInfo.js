import React from "react";
import styled from "styled-components";

import Weather from "./CountryInfo_Weather";
import CountryClock from "./CountryInfo_Clock";

const CountryInfoDiv = styled.div`
  /* height: 100%; */
  /* border: 1px white solid; */
  color: white;
  display: flex;
  justify-content: space-between;
  /* overflow: scroll; */
  /* @media (max-width: 1920px) {
    width: 40%;
    min-width: 575px;
  }
  @media (max-width: 1280px) {
    width: 35%;
    min-width: 0;
  }
  @media (max-width: 1180px) {
    width: calc(47% - 20px);
    padding: 20px 0 20px 20px;
  }
  @media (max-width: 1040px) {
    width: 100%;
    height: auto;
  }
  @media (max-width: 630px) {
    padding: 10px 0 0;
    justify-content: center;
  } */
`;

const LeftDiv = styled.div`
  /* max-width: 320px; */
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
  /* @media (max-width: 1180px) {
    font-size: 38px;
  }
  @media (max-width: 1040px) {
    display: none;
  } */
`;
const WeatherShow = styled.div`
  display: flex;
  /* @media (min-height: 860px) {
    display: block;
  } */
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
          <i className="fas fa-archway"></i>
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
        {/* <WeatherRight>
          <Weather weatherData={weather} />
        </WeatherRight> */}
      </RightDiv>
    </CountryInfoDiv>
  );
}
