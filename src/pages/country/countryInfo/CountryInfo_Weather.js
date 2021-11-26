import React from "react";
import styled from "styled-components";

const WeatherDiv = styled.div`
  margin: 0 0 0 20px;
  font-weight: bold;
  font-size: 30px;
  @media (max-height: 1120px) {
    font-size: 24px;
  }
`;

const WeatherContent = styled.div`
  margin-top: 20px;
  display: flex;
  @media (max-height: 900px) {
    margin-top: 15px;
  }
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
      <WeatherContent>
        <WeatherIcon>
          <i className="fas fa-cloud-sun" />
        </WeatherIcon>
        <div>{weather}</div>
      </WeatherContent>
      <WeatherContent>
        <TempIcon>
          <i className="fas fa-temperature-high" />
        </TempIcon>
        <div>{temp !== "No Data" ? temp + "℃" : temp}</div>
      </WeatherContent>
    </WeatherDiv>
  );
}
