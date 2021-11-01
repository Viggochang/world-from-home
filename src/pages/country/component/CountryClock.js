import React, { useEffect, useState } from "react";
import styled from "styled-components";

import Clock from "react-clock";
import "react-clock/dist/Clock.css";
import "./clock.css";

const ClockDiv = styled.div`
  /* display: flex;
  flex-direction: column; */
  margin-left: 30px;
  @media (min-height: 1080px) {
    margin-left: 50px;
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
  /* margin-top: 20px;
  @media (min-height: 1080px){ */
  /* margin-top: 60px;
  } */
`;

export default function CountryClock({ timezone }) {
  // console.log(timezone);
  // console.log(new Date(new Date().getTime()+(-28800+timezone)*1000));
  const [localTime, setLocalTime] = useState(
    new Date(new Date().getTime() + (-28800 + timezone) * 1000)
  );
  // console.log(localTime);
  useEffect(() => {
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
  }, [timezone]);

  return (
    <ClockDiv>
      <ClockText>
        <div>{localTime.toDateString().slice(4)}</div>
        <div>{ localTime.toTimeString().split("GMT")[0]} </div>
      </ClockText>
      <ClockStyle value={localTime} />
    </ClockDiv>
  );
}
