import { style } from "@mui/system";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import styled from "styled-components";
import countryTrans from "../../../../util/countryTrans";

const PopupDiv = styled.div`
  display: none;
  background-color: #3a4a58;
  border-radius: 10px;
  width: 337.5px;
  height: 567px;
  position: fixed;
  right: 5%;
  top: 8%;
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

const CaptainTitleDiv = styled.div`
  /* padding: 0 20px; */
  width: 260px;
  outline: 1px white solid;
  font-size: 32px;
  line-height: 50px;
  border-radius: 25px;
  text-align: center;
  margin: 40px auto 0;
`;

const FriendContainer = styled.div`
  margin-top: 20px;
  height: 400px;
  overflow: scroll;
`;

const FriendDiv = styled.div`
  display: flex;
  margin: 20px 40px;
`;

const FriendPhoto = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 20px;
`;

const FriendInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const FriendName = styled.div`
  color: white;
  font-size: 36px;
  line-height: 50px;
  font-weight: bold;
`;

const FriendCountry = styled.div`
  color: white;
  font-size: 20px;
  line-height: 30px;
`;

export default function CountryFriendPopup({ popupRef, friendHere }) {
  const history = useHistory();
  function handleClickBack() {
    popupRef.current.style.display = "none";
  }
  return (
    <PopupDiv ref={popupRef}>
      {" "}
      <BackDiv onClick={handleClickBack}>
        <i className="fas fa-times-circle" />
      </BackDiv>
      <CaptainTitleDiv>
        <i className="fas fa-users"></i>
        &ensp;{`Friends`}
      </CaptainTitleDiv>
      <FriendContainer>
        {friendHere.map((friend, index) => (
          <FriendDiv key={`friend-here-${index}`}>
            <FriendPhoto
              style={{
                backgroundImage: `url(${friend.photo})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              onClick={() => {
                history.push({ pathname: "user", search: `?id=${friend.id}` });
              }}
            />
            <FriendInfo>
              <FriendName>{friend.name}</FriendName>
              <FriendCountry>
                <i className="fas fa-globe"></i>
                &ensp;{countryTrans[friend.country].name_en}
              </FriendCountry>
            </FriendInfo>
          </FriendDiv>
        ))}
      </FriendContainer>
    </PopupDiv>
  );
}
