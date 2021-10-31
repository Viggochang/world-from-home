import React, { useEffect, useState } from "react";
import styled from "styled-components";

import Clock from "react-clock";

export default function CountryClock({captain}) {
  const [localTime, setLocalTime] = useState(new Date());
  const { latitude, longitude } = captain;

  useEffect(() => {
    fetch(
      `https://api.timezonedb.com/v2.1/get-time-zone?key=NHXNKFE6YNF9&format=json&by=position&lat=${latitude}&lng=${longitude}`
    )
      .then((res) => res.json())
      .then((res) => {
        console.log(new Date(res.formatted));
        setLocalTime(new Date(res.formatted));
      });
  }, [captain]);

  return <Clock value={new Date()}/>
  // localTime ? (
  //   <Clock value={new Date()}/>
  // ) : (
  //   <></>
  // );
  // const [value, setValue] = useState(new Date());
 
  // useEffect(() => {
  //   const interval = setInterval(
  //     () => setValue(new Date()),
  //     1000
  //   );
 
  //   return () => {
  //     clearInterval(interval);
  //   }
  // }, []);
 
  // return (
  //   <div>
  //     {/* <p>Current time:</p> */}
  //     <Clock value={new Date()} />
  //   </div>
  // )
}
