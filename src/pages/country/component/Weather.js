import React from 'react'
import styled from "styled-components";

const WeatherDiv = styled.div`
  width: 200px
`;

export default function Weather() {
  return (
    <WeatherDiv>
      <img id="wicon" src="http://openweathermap.org/img/w/10d.png" style={{width: '100%'}} alt="Weather icon"></img>
    </WeatherDiv>
  )
}
