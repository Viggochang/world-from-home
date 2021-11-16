import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import Weather from "./CountryInfo_Weather";
import CountryClock from "./CountryInfo_Clock";
import CountryInfoPopup from "./countryInfo/CountryInfoPopup";

const CountryInfoDiv = styled.div`
  height: calc(43% - 100px);
  /* border: 1px white solid; */
  padding: 20px;
  color: white;
  display: flex;
  justify-content: space-around;
  overflow: scroll;
  @media (max-width: 1920px) {
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
  }
`;

const LeftDiv = styled.div`
  /* max-width: 320px; */
  display: flex;
  flex-direction: column;
`;

const CaptainTitleDiv = styled.div`
  /* width: 320px; */
  padding: 0 50px;
  outline: 1px white solid;
  font-size: 32px;
  line-height: 50px;
  border-radius: 25px;
  text-align: center;

  @media (max-width: 1040px) {
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
  }
`;

const CaptainCity = styled.div`
  margin: 20px 0 0 20px;
  font-size: 44px;
  font-weight: bold;
  text-align: left;
  @media (max-width: 1180px) {
    font-size: 38px;
  }
  @media (max-width: 1040px) {
    display: none;
  }
`;

const RightDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

const WeatherShow = styled.div`
  display: none;
  @media (min-height: 860px) {
    display: block;
  }
`;
const WeatherRight = styled.div`
  /* margin-left: 50px; */
  display: none;
  @media (max-height: 860px) and (min-width: 1280px) {
    display: block;
  }
`;

export default function CountryInfo() {
  const targetCountry = useSelector((state) => state.targetCountry);
  const popupRef = useRef();

  const [captain, setCaptain] = useState({});
  const [timezone, setTimezone] = useState(0);
  const [weather, setWeather] = useState({});

  useEffect(() => {
    fetch(
      `https://api.worldbank.org/v2/country/${targetCountry.id}?format=json`
    )
      .then((res) => res.json())
      .then((res) => {
        if (targetCountry.id === "TW") {
          setCaptain({
            capitalCity: "Taipei",
            longitude: 121.5,
            latitude: 25.04,
          });
          return "Taipei";
        } else if (res[1]) {
          const { capitalCity, longitude, latitude } = res[1][0];
          console.log(capitalCity, longitude, latitude);
          setCaptain({ capitalCity, longitude, latitude });
          return capitalCity;
        } else {
          return null;
        }
      })
      .then((capitalCity) => {
        if (capitalCity) {
          fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${capitalCity}&appid=4768302d866115e64f3205b3939e2f19&units=metric`
          )
            .then((res) => res.json())
            .then((res) => {
              setTimezone(res.timezone || "No Data");
              setWeather({
                temp: res.main ? res.main.temp : "No Data",
                weather: res.weather ? res.weather[0].description : "No Data",
              });
            });
        }
      });
  }, [targetCountry]);

  function handlePopup() {
    popupRef.current.style.display = "flex";
  }

  return (
    <CountryInfoDiv>
      <LeftDiv>
        <CaptainTitleDiv onClick={handlePopup}>
          <i className="fas fa-archway"></i>&ensp;Capital City
        </CaptainTitleDiv>
        <CaptainCity>{captain.capitalCity}</CaptainCity>
        <WeatherShow>
          <Weather weatherData={weather} />
        </WeatherShow>
      </LeftDiv>
      <RightDiv>
        <CountryClock timezone={timezone} />
        <WeatherRight>
          <Weather weatherData={weather} />
        </WeatherRight>
      </RightDiv>
      <CountryInfoPopup
        captain={captain}
        popupRef={popupRef}
        weatherData={weather}
        timezone={timezone}
      />
    </CountryInfoDiv>
  );
}
