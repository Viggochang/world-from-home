import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import styled from "styled-components";
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

import { db_userInfo } from "../../../util/firebase";

const MyFriendsContentDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-left: 50px;
  width: calc(100% - 320px);
`;

const FilterDiv = styled.div`
  display: flex;
  align-items: center;
  height: 56px;
  width: 100%;
`;

const Title = styled.div`
  color: white;
  font-size: 48px;
  font-weight: bold;
  margin-right: auto;
`;

const RequestBtn = styled.div`
  width: 50px;
  height: 50px;
  color: #3A4A58;
  font-size: 30px;
  outline: 1px #3A4A58 solid;
  border-radius: 50%;
  display: flex;
  background-color: rgb(255, 255, 255,0.7);
  cursor: pointer;
`;
const SearchInput = styled.div`
  outline: 1px #3A4A58 solid;
  border-radius: 22px;
  padding-left: 15px;
  background-color: rgb(255, 255, 255,0.7);
  margin-left: 20px;
`;

const ContentDiv = styled.div`
  outline: 2px #3a4a58 solid;
  padding: 30px 30px 0;
  margin-top: 15px;
  width: calc(100% - 60px);
  max-height: calc(100vh - 200px);
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-content: space-between;
  background-color: rgb(255,255,255, 0.5);
`;

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

export default function MyFriends({title}) {
  const userInfo = useSelector((state) => state.userInfo);
  const [myFriends, setMyFriends] = useState([]);
  const { id } = userInfo;

  useEffect(() => {
    if (id) {
      db_userInfo
        .where("friends", "array-contains", id)
        .get()
        .then((querySnapshot) => {
          setMyFriends(querySnapshot.docs.map((doc) => doc.data()));
          console.log(querySnapshot.docs.map((doc) => doc.data()));
        });
      }
  }, [id]);

  return (
    <MyFriendsContentDiv>
      <FilterDiv>
        <Title>{title}</Title>
        <RequestBtn>
          <i className="fas fa-user-plus" style={{margin: 'auto'}}></i>
        </RequestBtn>
        <SearchInput>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            style={{color: "black"}}
            placeholder="Search My Friends"
            inputProps={{ 'aria-label': 'search google maps' }}
          />
          <IconButton sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </SearchInput>
      </FilterDiv>
      {/* <ContentDiv style={{height:`${140*Math.ceil(myFriends.length/2)-40}px`}}> */}
      <ContentDiv>
      {myFriends.map((friend, index) => (
        <FriendDiv key={index}>
          <FriendPhoto
            style={{
              background:`url(${friend.photo})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></FriendPhoto>
          <FriendInfo>
            <FriendName>{friend.name}</FriendName>
            <FriendCountry><i className="fas fa-globe"></i> {friend.country}</FriendCountry>
          </FriendInfo>
        </FriendDiv>
      ))}
      </ContentDiv>
    </MyFriendsContentDiv>
  )
}
