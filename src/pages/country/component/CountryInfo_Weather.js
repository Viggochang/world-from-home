import React from "react";
import styled from "styled-components";

const WeatherDiv = styled.div`
  @media (min-width: 1350px) and (min-height: 1080px) {
    margin: 10px 0 0 20px;
    font-size: 35px;
    line-height: 50px;
  }
  margin: 5px 0 0 20px;
  font-size: 20px;
  font-weight: bold;
  line-height: 30px;
  @media (max-width: 1040px) {
    display: none;
  }
  /* 
  @media (min-height: 1080px) {
    margin: 10px 0 0 20px;
    font-size: 35px;
    line-height: 50px;
  } */
`;

const WeatherDescription = styled.div`
  display: flex;
`;
const WeatherTemp = styled.div`
  margin-top: 10px;
  display: flex;
`;
const WeatherIcon = styled.div`
  margin-right: 15px;
`;
const TempIcon = styled.div`
  margin-right: 20px;
`;

export default function Weather({ weatherData }) {
  const { temp, weather } = weatherData;
  return (
    <WeatherDiv>
      {/* <img id="wicon" src="http://openweathermap.org/img/w/10d.png" style={{width: '100%'}} alt="Weather icon"></img> */}
      <WeatherTemp>
        <WeatherIcon>
          <i className="fas fa-cloud-sun"></i>
        </WeatherIcon>
        <div>{weather}</div>
      </WeatherTemp>
      <WeatherTemp>
        <TempIcon>
          <i className="fas fa-temperature-high"></i>
        </TempIcon>
        <div>{temp !== "No Data" ? temp + "℃" : temp}</div>
      </WeatherTemp>
    </WeatherDiv>
  );
}
