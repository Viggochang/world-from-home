import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import styled from "styled-components";
import countryTrans from "../../../util/countryTrans";
import { getUserDataByUid } from "../../../util/firebase";

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
  cursor: pointer;
  box-shadow: 0px 0px 10px #bebebe;
  background-image: url(${(props) => props.photo});
  background-size: cover;
  background-position: center;
`;

const FriendInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - 100px);
`;

const FriendNameDiv = styled.div`
  color: white;
  font-size: 36px;
  line-height: 50px;
  font-weight: bold;
  overflow: scroll;
`;

const FriendCountry = styled.div`
  color: white;
  font-size: 20px;
  line-height: 30px;
`;

export default function CountryFriendPopup({ popupRef, friendHere }) {
  const history = useHistory();
  const [friendHereInfo, setFriendHereInfo] = useState([]);

  useEffect(() => {
    Promise.all(friendHere.map((friend) => getUserDataByUid(friend.id))).then(
      (arr) => {
        setFriendHereInfo(arr);
      }
    );
  }, [friendHere]);

  function handleClickBack() {
    popupRef.current.style.display = "none";
  }
  return (
    <PopupDiv ref={popupRef}>
      <ContentDiv>
        <BackDiv onClick={handleClickBack}>
          <i className="fas fa-times-circle" />
        </BackDiv>
        <CaptainTitleDiv>
          <i className="fas fa-users" />
          &ensp;Friends
        </CaptainTitleDiv>
        <FriendContainer>
          {friendHereInfo.map((friend, index) => (
            <FriendDiv key={`friend-here-${index}`}>
              <FriendPhoto
                photo={friend.photo}
                onClick={() => {
                  history.push({
                    pathname: "user",
                    search: `?id=${friend.id}`,
                  });
                }}
              />
              <FriendInfo>
                <FriendNameDiv>
                  <div>{friend.name}</div>
                </FriendNameDiv>
                <FriendCountry>
                  <i className="fas fa-globe" />
                  &ensp;{countryTrans[friend.country].name_en}
                </FriendCountry>
              </FriendInfo>
            </FriendDiv>
          ))}
        </FriendContainer>
      </ContentDiv>
    </PopupDiv>
  );
}
