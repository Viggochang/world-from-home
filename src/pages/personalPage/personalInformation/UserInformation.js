import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import countryTrans from "../../../util/countryTrans";
import Photo from "./userInformationComponent/photo/Photo";
import MoreInformation from "./userInformationComponent/moreInformation/MoreInformation";
import FriendState from "../personialFriend/FriendState";

const UpperDiv = styled.div`
  display: flex;
  width: calc(100vw - 160px);
  max-width: 1500px;
  position: relative;
  @media (max-width: 932px) {
    flex-direction: column;
    align-items: center;
  }
  @media (max-width: 640px) {
    width: calc(100vw - 60px);
  }
`;

const UserInfoDiv = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
  margin-left: 40px;
  max-width: calc(100vw - 704px);
  font-weight: bold;
  line-height: 1.15;
  @media (max-width: 932px) {
    max-width: 500px;
    margin-left: 0;
    margin-top: 20px;
    border-left: 4px white solid;
    padding-left: 20px;
  }
`;

const NameDiv = styled.div`
  font-size: 92px;
  @media (max-width: 1180px) {
    font-size: 64px;
  }
`;
const TextDiv = styled.div`
  font-size: 30px;
  @media (max-width: 1180px) {
    font-size: 24px;
  }
`;
const AgeDiv = styled.div`
  font-size: 30px;
  margin-bottom: 22px;
  @media (max-width: 1180px) {
    font-size: 24px;
  }
`;

const CountryDiv = styled.div`
  display: flex;
`;
const MyCountryDiv = styled.div`
  font-size: 88px;
  display: flex;
  align-items: baseline;
  @media (max-width: 1180px) {
    font-size: 40px;
    line-height: 50px;
  }
`;

export default function UserInformation({ userInfo }) {
  const myInfo = useSelector((state) => state.userInfo);

  const { name, country, photo, birthday } = userInfo;
  const age =
    birthday &&
    new Date(birthday.seconds * 1000).toDateString() !==
      new Date(0).toDateString()
      ? new Date().getFullYear() -
        new Date(1000 * birthday.seconds).getFullYear()
      : "unknown";

  return (
    <UpperDiv>
      <Photo photo={photo} />
      <UserInfoDiv>
        <NameDiv>{name}</NameDiv>
        <TextDiv>from</TextDiv>
        <CountryDiv>
          <MyCountryDiv>
            {country ? countryTrans[country].name_en : ""}
          </MyCountryDiv>
        </CountryDiv>
        <AgeDiv>{`age: ${age}`}</AgeDiv>

        <MoreInformation userInfo={userInfo} />
        {!!myInfo.id && <FriendState userInfo={userInfo} />}
      </UserInfoDiv>
    </UpperDiv>
  );
}
