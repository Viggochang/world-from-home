import React from 'react';
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { nanoid } from 'nanoid';

import countryTrans from '../../../util/countryTrans';

const FriendDiv = styled.div`
  display: flex;
  width: 50%;
  margin-bottom: 30px;
`;
const FriendPhoto = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  box-shadow: 0px 0px 20px #4F4F4F;
  cursor: pointer;
`
const FriendInfo = styled.div`
  margin-left: 30px;
  display: flex;
  flex-direction: column;
  color: #3A4A58;
  width: calc(100% - 130px);
  height: 100px;
  position: relative;
`;
const FriendName = styled.div`
  font-size: 36px;
  font-weight: bold;
  cursor: pointer;
`;
const FriendCountry = styled.div`
  font-size: 24px;
  line-height: 40px;
`;

export default function Friend({friend}) {
  const {id, photo, name, country} = friend;

  return (
    <FriendDiv>
      <NavLink to={`/user?id=${id}`}>
        <FriendPhoto
          style={{
            background:`url(${photo})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></FriendPhoto>
      </NavLink>
      <FriendInfo>
        <FriendName>{name}</FriendName>
        <FriendCountry><i className="fas fa-globe"></i> {country ? countryTrans[country].name_en : ''}</FriendCountry>
      </FriendInfo>
    </FriendDiv>
  )
}
