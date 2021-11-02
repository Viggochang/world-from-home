import React from 'react'
import styled from "styled-components";

const WeatherDiv = styled.div`
  margin: 5px 0 0 20px;
  font-size: 20px;
  font-weight: bold;
  line-height: 30px;
  @media (min-height: 1080px){
    margin: 10px 0 0 20px;
    font-size: 35px;
    line-height: 60px;
  }
`;

export default function Weather({weatherData}) {
  const {temp, weather} = weatherData;
  return (
    <WeatherDiv>
      {/* <img id="wicon" src="http://openweathermap.org/img/w/10d.png" style={{width: '100%'}} alt="Weather icon"></img> */}
      <div><i className="fas fa-cloud-sun"></i>&ensp;{weather}</div>
      <div><i className="fas fa-temperature-high"></i>&ensp; {temp} ℃</div>
    </WeatherDiv>
  )
}
