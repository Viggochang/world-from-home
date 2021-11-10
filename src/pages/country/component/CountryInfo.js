import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import Weather from "./CountryInfo_Weather";
import CountryClock from "./CountryInfo_Clock";

const CountryInfoDiv = styled.div`
  /* width: calc(50% - 60px); */
  height: calc(43% - 100px);
  /* border: 1px white solid; */
  padding: 20px;
  color: white;
  display: flex;
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
`;

const CaptainCity = styled.div`
  margin: 20px 0 0 20px;
  font-size: 50px;
  font-weight: bold;
  text-align: left;
`;

export default function CountryInfo() {
  const targetCountry = useSelector((state) => state.targetCountry);

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

  return (
    <CountryInfoDiv>
      <LeftDiv>
        <CaptainTitleDiv>
          <i className="fas fa-archway"></i>&ensp;Capital City
        </CaptainTitleDiv>
        <CaptainCity>{captain.capitalCity}</CaptainCity>
        <Weather weatherData={weather} />
      </LeftDiv>
      <CountryClock timezone={timezone} />
    </CountryInfoDiv>
  );
}
