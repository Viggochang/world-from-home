import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import Weather from "./CountryInfo_Weather";
import CountryClock from "./CountryInfo_Clock";
import CountryInfoPopup from "./countryInfo/CountryInfoPopup";

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
`;

const CaptainTitleDiv = styled.div`
  width: 300px;
  display: none;
  /* padding: 0 40px; */
  outline: 1px white solid;
  font-size: 32px;
  line-height: 50px;
  border-radius: 25px;
  color: white;
  justify-content: center;
  align-items: center;
  align-self: flex-start;
  @media (max-width: 1180px) {
    display: flex;
  }

  /* @media (max-width: 1040px) {
    width: 240px;
    cursor: pointer;
    margin-left: 30px;
    background-color: rgb(255, 255, 255, 0.4);
    :hover {
      color: #3a4a58;
    }
  }

  @media (max-width: 1180px) {
    font-size: 28px;
    padding: 0 25px;
  }

  @media (max-width: 630px) {
    margin: 20px 0;
    padding: 0 10px;
  } */
`;

const CaptainCity = styled.div`
  margin: 20px 0 0 20px;
  font-size: 40px;
  font-weight: bold;
  text-align: left;
  /* @media (max-width: 1180px) {
    font-size: 38px;
  }
  @media (max-width: 1040px) {
    display: none;
  } */
`;
const WeatherShow = styled.div`
  display: flex;
  font-size: 30px;
  /* @media (min-height: 860px) {
    display: block;
  } */
`;

const RightDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 60px;
  @media (max-width: 1440px) {
    display: none;
  }
`;
const WeatherRight = styled.div`
  /* margin-left: 50px; */
  display: none;
  /* @media (max-height: 860px) and (min-width: 1280px) {
    display: block;
  } */
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
