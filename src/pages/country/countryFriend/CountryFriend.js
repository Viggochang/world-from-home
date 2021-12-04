import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { getUserDataByUid } from "../../../util/firebase";

import countryTrans from "../../../util/countryTrans";

const FriendsContainerDiv = styled.div`
  height: 100%;
  margin-left: 60px;
  color: white;
  overflow-x: scroll;
  flex-grow: 1;
  @media (max-width: 1180px) {
    margin-left: 0;
    flex-grow: 0;
    height: auto;
  }
`;

const InfoTitle = styled.div`
  width: 100%;
  font-size: 32px;
  line-height: 48px;
  border-bottom: 2px white solid;
  margin-top: 20px;
  @media (max-width: 1180px) {
    display: none;
  }
  @media (max-height: 900px) {
    font-size: 28px;
    line-height: 32px;
  }
`;

const MyFriendsContainer = styled.div`
  height: calc(100% - 102px);
  margin: 20px 0 0 20px;
  display: flex;
  align-items: center;
  overflow: scroll;
  @media (max-width: 1180px) {
    display: none;
  }
`;

const FriendHere = styled.div`
  height: calc(100% - 20px);
  margin-right: 40px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-height: 900px) {
    margin-right: 25px;
  }
`;

const FriendHerePhoto = styled.div`
  height: calc(90% - 73px);
  aspect-ratio: 1;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0px 0px 10px #bebebe;
  background-image: url(${(props) => props.photo});
  background-size: cover;
  background-position: center;
  @media (max-height: 900px) {
    height: calc(100% - 51px);
  }
`;

const FriendHereInfoName = styled.div`
  width: fit-content;
  font-size: 24px;
  line-height: 28px;
  margin: 15px auto 0;
  padding: 0 15px;
  border-radius: 16px;
  background-color: white;
  color: #3a4a58;
  cursor: pointer;
  :hover {
    background-color: #b8c3d0;
  }
  @media (max-height: 900px) {
    font-size: 16px;
    line-height: 20px;
  }
`;
const FriendHereInfoCountry = styled.div`
  width: fit-content;
  margin-top: 10px;
  font-size: 18px;
  @media (max-height: 900px) {
    margin-top: 5px;
    font-size: 14px;
  }
`;

export default function CountryFriend({ friendHere }) {
  const history = useHistory();
  const [friendHereInfo, setFriendHereInfo] = useState([]);

  useEffect(() => {
    Promise.all(friendHere.map((friend) => getUserDataByUid(friend.id))).then(
      (arr) => {
        setFriendHereInfo(arr);
      }
    );
  }, [friendHere]);

  return (
    <FriendsContainerDiv>
      <InfoTitle>Friends</InfoTitle>
      <MyFriendsContainer>
        {friendHereInfo.map((friend, index) => (
          <FriendHere key={`friend-here-${index}`}>
            <FriendHerePhoto
              photo={friend.photo}
              onClick={() => {
                history.push({
                  pathname: "user",
                  search: `?id=${friend.id}`,
                });
              }}
            />
            <FriendHereInfoName
              onClick={() => {
                history.push({
                  pathname: "user",
                  search: `?id=${friend.id}`,
                });
              }}
            >
              {friend.name}
            </FriendHereInfoName>
            <FriendHereInfoCountry>
              <i className="fas fa-globe" />
              &ensp;{countryTrans[friend.country].name_en}
            </FriendHereInfoCountry>
          </FriendHere>
        ))}
      </MyFriendsContainer>
    </FriendsContainerDiv>
  );
}
