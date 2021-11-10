import React from "react";
import styled from "styled-components";

import CountryShape from "./component/CountryShape";
import CountryAlbums from "./component/CountryAlbums";
import CountryInfo from "./component/CountryInfo";
import CountryFriend from "./component/CountryFriend";

const CountryDiv = styled.div`
  width: calc(90% - 160px);
  height: calc(90% - 140px);
  padding: 60px 60px 20px;
  /* background-color: rgba(63, 63, 63, 1); */
  position: fixed;
  top: 5%;
  left: 5%;
  z-index: 2;
  transition: background-color 0.5s, visibility 0.5s, opacity 0.5s;
  transition-delay: 1s;
  flex-wrap: wrap;
`;

// const OtherGalleryDiv = styled.div`
//   width: 80%;
//   height: 25%;
//   margin-bottom: 10px;
//   border: 1px white solid;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   color: white;
//   font-size: 30px;
//   font-weight: bold;
//   cursor: pointer;
// `;

const BackDiv = styled.div`
  position: absolute;
  top: 15px;
  right: 20px;
  color: #9d9d9d;
  font-weight: bold;
  font-size: 28px;
  cursor: pointer;
  :hover {
    color: white;
  }
`;

function Country({ style, handleClickBack, signinRef }) {
  return (
    <CountryDiv style={style}>
      <CountryShape />
      <CountryAlbums signinRef={signinRef} />
      <CountryInfo />
      <CountryFriend />
      <BackDiv onClick={handleClickBack}>
        <i className="fas fa-times-circle" />
      </BackDiv>
    </CountryDiv>
  );
}

export default Country;
