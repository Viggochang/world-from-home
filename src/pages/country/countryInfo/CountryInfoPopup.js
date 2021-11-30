import React, { useState, useEffect } from "react";
import styled from "styled-components";

import Clock from "react-clock";
import "react-clock/dist/Clock.css";
import "./clock.css";

const PopupDiv = styled.div`
  width: 90%;
  height: 85%;
  z-index: 3;
  background-color: rgb(0, 0, 0, 0.7);
  display: none;
  align-items: center;
  justify-content: center;
  position: fixed;
  right: 5%;
  top: 5%;
  border-radius: 10px;
  @media (max-width: 600px) {
    top: 8%;
  }
`;

const ContentDiv = styled.div`
  display: flex;
  background-color: rgb(142, 156, 172);
  border-radius: 10px;
  width: 337.5px;
  height: 567px;
  flex-direction: column;
  position: relative;
`;

const BackDiv = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  color: rgb(255, 255, 255, 0.7);
  font-weight: bold;
  font-size: 20px;
  cursor: pointer;
  :hover {
    color: white;
  }
`;

const CaptainTitleDiv = styled.div`
  width: 260px;
  outline: 1px white solid;
  font-size: 32px;
  line-height: 50px;
  border-radius: 25px;
  text-align: center;
  margin: 40px auto 0;
  background-color: rgb(184, 195, 208, 0.5);
`;

const CaptitalTitle = styled.div`
  font-size: 16px;
  border-bottom: 1px white solid;
  margin: 20px 40px 0;
  width: fit-content;
`;

const CaptainCity = styled.div`
  margin: 5px 0 0 40px;
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
      <ContentDiv>
        <BackDiv onClick={handleClickBack}>
          <i className="fas fa-times-circle" />
        </BackDiv>
        <CaptainTitleDiv>
          <i className="fas fa-info" />
          &ensp;Information
        </CaptainTitleDiv>
        <CaptitalTitle>Captital City</CaptitalTitle>
        <CaptainCity>{captain.capitalCity}</CaptainCity>
        <WeatherDiv>
          <WeatherTemp>
            <WeatherIcon>
              <i className="fas fa-cloud-sun" />
            </WeatherIcon>
            <div>{weather}</div>
          </WeatherTemp>
          <WeatherTemp>
            <TempIcon>
              <i className="fas fa-temperature-high" />
            </TempIcon>
            <div>{temp !== "No Data" ? temp + "℃" : temp}</div>
          </WeatherTemp>
        </WeatherDiv>
        <ClockDiv>
          {timezone !== "No Data" ? (
            <>
              <ClockText>
                <div>
                  {localTime.toDateString().slice(4)} &ensp;
                  {localTime.toTimeString().split("GMT")[0]}
                </div>
              </ClockText>
              <ClockStyle value={localTime} />
            </>
          ) : (
            <ClockText>No data</ClockText>
          )}
        </ClockDiv>
      </ContentDiv>
    </PopupDiv>
  );
}
