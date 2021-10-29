import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { nanoid } from "nanoid";

import styled from "styled-components";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Friend from "./Friend";

import { db_userInfo } from "../../../util/firebase";
import countryTrans from "../../../util/countryTrans";

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
  color: #3a4a58;
  font-size: 30px;
  outline: 1px #3a4a58 solid;
  border-radius: 50%;
  display: flex;
  background-color: rgb(255, 255, 255, 0.7);
  cursor: pointer;
`;
const SearchInput = styled.div`
  outline: 1px #3a4a58 solid;
  border-radius: 22px;
  padding-left: 15px;
  background-color: rgb(255, 255, 255, 0.7);
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
  background-color: rgb(255, 255, 255, 0.5);
`;

const FriendResultDiv = styled.div`
  border-bottom: 1px #3a4a58 solid;
  margin-bottom: -1px;
  width: 100%;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
`;

const FriendResult = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const ResultTitle = styled.div`
  font-size: 36px;
  font-weight: bold;
  margin: auto;
  margin-bottom: 30px;
  color: #3a4a58;
  text-align: center;
`;

export default function MyFriends({ title, userInfo }) {
  // const userInfo = useSelector((state) => state.userInfo);
  const [myFriends, setMyFriends] = useState([]);
  const [searchInput, setSearchInput] = useState();
  const { id, friends } = userInfo;

  useEffect(() => {
    if (id) {
      db_userInfo
        .where("friends", "array-contains", id)
        .onSnapshot((querySnapshot) => {
          const friends = [];
          querySnapshot.forEach((friend) => {
            friends.push(friend.data());
          });
          setMyFriends(friends);
        });
    }
  }, [id]);

  function handleSearch(e) {
    const searchInput = e.target.value;
    setSearchInput(searchInput);
  }

  return (
    <MyFriendsContentDiv>
      <FilterDiv>
        <Title>{title}</Title>
        <RequestBtn>
          <i className="fas fa-user-plus" style={{ margin: "auto" }}></i>
        </RequestBtn>
        <SearchInput>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            style={{ color: "black" }}
            placeholder="Search My Friends"
            inputProps={{ "aria-label": "search google maps" }}
            onChange={(e) => handleSearch(e)}
          />
          <IconButton sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </SearchInput>
      </FilterDiv>
      {/* <ContentDiv style={{height:`${140*Math.ceil(myFriends.length/2)-40}px`}}> */}
      <ContentDiv>
        {myFriends.length && searchInput ? (
          <FriendResultDiv>
            {myFriends.filter(({ name }) =>
              name.toLowerCase().includes(searchInput.toLowerCase())
            ).length ? (
              <>
                <ResultTitle>Results</ResultTitle>
                <FriendResult>
                  {myFriends
                    .filter(({ name }) =>
                      name.toLowerCase().includes(searchInput.toLowerCase())
                    )
                    .map((friend) => {
                      return <Friend key={nanoid()} friend={friend} />;
                    })}
                </FriendResult>
              </>
            ) : (
              <ResultTitle>No Results！</ResultTitle>
            )}
          </FriendResultDiv>
        ) : (
          <></>
        )}
        {myFriends.length ? (
          myFriends
            .filter(
              ({ name }) =>
                !searchInput ||
                !name.toLowerCase().includes(searchInput.toLowerCase())
            )
            .map((friend) => {
              return <Friend key={nanoid()} friend={friend} />;
            })
        ) : (
          <ResultTitle>No Friends</ResultTitle>
        )}
      </ContentDiv>
    </MyFriendsContentDiv>
  );
}
