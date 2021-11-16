import React, { useState, useEffect } from "react";
import styled from "styled-components";

import Clock from "react-clock";
import "react-clock/dist/Clock.css";
import "../clock.css";

const PopupDiv = styled.div`
  display: none;
  background-color: #3a4a58;
  border-radius: 10px;
  width: 337.5px;
  height: 510.3px;
  position: fixed;
  right: 5%;
  top: 5%;
  z-index: 3;
  /* display: flex; */
  flex-direction: column;
  /* display: none; */
  /* @media (min-width: 1041px) {
    &&& {
      display: none;
    }
  } */
`;

const CaptainTitleDiv = styled.div`
  /* padding: 0 20px; */
  width: 260px;
  outline: 1px white solid;
  font-size: 32px;
  line-height: 50px;
  border-radius: 25px;
  text-align: center;
  margin: 30px auto 0;
`;

const BackDiv = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  color: #9d9d9d;
  font-weight: bold;
  font-size: 20px;
  cursor: pointer;
  :hover {
    color: white;
  }
`;

const CaptainCity = styled.div`
  margin: 20px 0 0 40px;
  font-size: 44px;
  font-weight: bold;
  text-align: left;
`;

const WeatherDiv = styled.div`
  margin: 5px 0 0 40px;
  font-size: 20px;
  font-weight: bold;
  line-height: 30px;
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

const ClockDiv = styled.div`
  /* display: none; */
  flex-direction: column;
  align-items: center;
  margin: 20px 40px 0 40px;
  padding-top: 20px;
  border-top: 1px white solid;
`;

const ClockText = styled.div`
  font-size: 22px;
  line-height: 28px;
  font-weight: bold;
  margin-bottom: 10px;
  width: 100%;
  /* text-align: center; */
`;
const ClockStyle = styled(Clock)`
  margin: 20px auto 0;
`;

export default function CountryInfoPopup({
  captain,
  popupRef,
  weatherData,
  timezone,
}) {
  function handleClickBack() {
    popupRef.current.style.display = "none";
  }
  const { temp, weather } = weatherData;
  const [localTime, setLocalTime] = useState(new Date());

  useEffect(() => {
    if (timezone !== "No Data") {
      const interval = setInterval(
        () =>
          setLocalTime(
            new Date(new Date().getTime() + (-28800 + timezone) * 1000)
          ),
        1000
      );
      return () => {
        clearInterval(interval);
      };
    }
  }, [timezone]);

  return (
    <PopupDiv ref={popupRef}>
      <BackDiv onClick={handleClickBack}>
        <i className="fas fa-times-circle" />
      </BackDiv>
      <CaptainTitleDiv>
        <i className="fas fa-archway"></i>&ensp;Capital City
      </CaptainTitleDiv>
      <CaptainCity>{captain.capitalCity}</CaptainCity>
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
      <ClockDiv>
        {timezone !== "No Data" ? (
          <>
            <ClockText>
              <div>
                {localTime.toDateString().slice(4)} &ensp;{" "}
                {localTime.toTimeString().split("GMT")[0]}{" "}
              </div>
            </ClockText>
            <ClockStyle value={localTime} />
          </>
        ) : (
          <ClockText>No data</ClockText>
        )}
      </ClockDiv>
    </PopupDiv>
  );
}
