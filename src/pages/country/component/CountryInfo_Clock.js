import React, { useEffect, useState } from "react";
import styled from "styled-components";

import Clock from "react-clock";
import "react-clock/dist/Clock.css";
import "./clock.css";

const ClockDiv = styled.div`
  display: none;
  flex-direction: column;
  align-items: center;
  margin-left: 50px;
  @media (min-width: 1280px) {
    display: flex;
  }
  @media (min-height: 1080px) and (min-width: 1350px) {
    margin-left: 0px;
  }
`;

const ClockText = styled.div`
  font-size: 22px;
  line-height: 28px;
  font-weight: bold;
  margin-bottom: 10px;
  width: 100%;
  text-align: center;
  @media (min-height: 1080px) {
    margin-bottom: 20px;
  }
`;
const ClockStyle = styled(Clock)`
  display: none;
  margin-top: 10px;
  @media (min-height: 860px) {
    display: block;
  }
  @media (min-height: 1080px) {
    margin-top: 20px;
  }
`;

export default function CountryClock({ timezone }) {
  // console.log(timezone);
  // console.log(new Date(new Date().getTime()+(-28800+timezone)*1000));
  const [localTime, setLocalTime] = useState(new Date());
  // console.log(localTime);

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
    <ClockDiv>
      {timezone !== "No Data" ? (
        <>
          <ClockText>
            <div>{localTime.toDateString().slice(4)}</div>
            <div>{localTime.toTimeString().split("GMT")[0]} </div>
          </ClockText>
          <ClockStyle value={localTime} />
        </>
      ) : (
        <ClockText>No data</ClockText>
      )}
    </ClockDiv>
  );
}
