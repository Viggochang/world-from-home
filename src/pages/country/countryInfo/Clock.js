import React, { useEffect, useState } from "react";
import styled from "styled-components";

import Clock from "react-clock";
import "react-clock/dist/Clock.css";
import "./clock.css";

const ClockDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ClockText = styled.div`
  margin-top: 20px;
  font-size: 26px;
  line-height: 32px;
  font-weight: bold;
  width: 100%;
  text-align: center;
  @media (max-height: 900px) {
    margin-top: 10px;
    font-size: 16px;
    line-height: 20px;
  }
  @media (max-height: 1120px) {
    font-size: 20px;
    line-height: 24px;
  }
`;
const ClockStyle = styled(Clock)`
  margin-top: 15px;
  display: block;
  @media (max-height: 900px) {
    margin-top: 10px;
  }
`;

export default function CountryClock({ timezone }) {
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
