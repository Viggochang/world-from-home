import React, { useState, useEffect, useRef } from "react";

import styled from "styled-components";
import InputBase from "@mui/material/InputBase";

import FriendSearchResults from "./FriendSearchResults";
import FriendRequests from "./FriendRequests";
import FriendList from "./FriendList";

import { db_userInfo } from "../../../util/firebase";

const MyFriendsContentDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-left: 50px;
  width: calc(100% - 320px);
  @media (max-width: 932px) {
    width: calc(100% - 60px);
    margin-left: 0;
  }
  @media (max-width: 640px) {
    width: 100%;
  }
`;

const FilterDiv = styled.div`
  display: flex;
  align-items: center;
  height: 56px;
  width: 100%;
  @media (max-width: 640px) {
    justify-content: flex-end;
  }
`;

const Title = styled.div`
  color: white;
  font-size: 48px;
  font-weight: bold;
  margin-right: auto;
  @media (max-width: 1180px) {
    font-size: 30px;
  }
  @media (max-width: 640px) {
    display: none;
  }
`;

const RequestBtn = styled.div`
  width: 60px;
  min-width: 60px;
  height: 60px;
  color: #3a4a58;
  font-size: 30px;
  /* outline: 2px #3a4a58 solid; */
  border-radius: 50%;
  position: relative;
  display: flex;
  background-color: rgb(255, 255, 255, 0.7);
  cursor: pointer;
  :hover {
    background-color: #b8c3d0;
    color: white;
  }
  @media (max-width: 640px) {
    /* margin-left: auto; */
  }
`;
const RequestAlert = styled.div`
  width: 20px;
  height: 20px;
  font-size: 16px;
  background-color: #ae0000;
  color: white;
  border-radius: 50%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  right: 0;
  bottom: 0;
`;
const SearchInput = styled.div`
  outline: 1px #3a4a58 solid;
  border-radius: 22px;
  padding: 0 40px 0 10px;
  background-color: rgb(255, 255, 255, 0.7);
  margin-left: 20px;
  position: relative;
  /* display: flex;
  align-items: center; */
`;

const SearchIconDiv = styled.div`
  font-size: 20px;
  position: absolute;
  right: 10px;
  top: calc(50% - 10px);
  color: #3a4a58;
`;

const ContentDiv = styled.div`
  /* outline: 2px #3a4a58 solid; */
  padding: 20px 30px 30px;
  margin-top: 15px;
  width: calc(100% - 60px);
  max-height: calc(100vh - 170px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: rgb(255, 255, 255, 0.5);
  border-radius: 10px;
  /* overflow: scroll; */
  @media (max-width: 932px) {
    flex-direction: column;
    align-items: center;
  }
  @media (max-width: 640px) {
    padding: 10px 10px 0;
    width: calc(100% - 20px);
  }
`;

export default function MyFriends({ title, userInfo, isMyPage }) {
  const [myFriends, setMyFriends] = useState([]);
  const [myFriendRequests, setMyFriendRequests] = useState([]);
  const [searchInput, setSearchInput] = useState();
  const [showFriendRequest, setShowFriendRequest] = useState(false);
  const friendRequestsRef = useRef();
  const { id } = userInfo;

  useEffect(() => {
    if (id) {
      db_userInfo
        .where("friends", "array-contains", { id: id, condition: "confirmed" })
        .onSnapshot((querySnapshot) => {
          const friends = [];
          querySnapshot.forEach((friend) => {
            friends.push(friend.data());
          });
          setMyFriends(friends);
        });
      db_userInfo
        .where("friends", "array-contains", {
          id: id,
          condition: "send_request",
        })
        .onSnapshot((querySnapshot) => {
          const friendRequests = [];
          querySnapshot.forEach((friend) => {
            friendRequests.push(friend.data());
          });
          setMyFriendRequests(friendRequests);
        });
    }
  }, [id]);

  function handleFriendRequest() {
    friendRequestsRef.current.style.backgroundColor = showFriendRequest
      ? "white"
      : "#3a4a58";
    friendRequestsRef.current.style.color = showFriendRequest
      ? "#3a4a58"
      : "white";
    // friendRequestsRef.current.style.outline = showFriendRequest
    //   ? "2px #3a4a58 solid"
    //   : "2px white solid";
    setShowFriendRequest(showFriendRequest ? false : true);
  }

  function handleSearch(e) {
    const searchInput = e.target.value;
    setSearchInput(searchInput);
  }

  return (
    <MyFriendsContentDiv>
      <FilterDiv>
        <Title>{title}</Title>
        {isMyPage ? (
          <RequestBtn ref={friendRequestsRef} onClick={handleFriendRequest}>
            <i className="fas fa-user-plus" style={{ margin: "auto" }} />
            {myFriendRequests.length ? (
              <RequestAlert>{myFriendRequests.length}</RequestAlert>
            ) : (
              <></>
            )}
          </RequestBtn>
        ) : (
          <></>
        )}
        <SearchInput>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            style={{ color: "#3a4a58" }}
            placeholder="Search Friends"
            inputProps={{ "aria-label": "search google maps" }}
            onChange={(e) => handleSearch(e)}
          />
          <SearchIconDiv>
            <i className="fas fa-search" />
          </SearchIconDiv>
        </SearchInput>
      </FilterDiv>

      <ContentDiv>
        <FriendSearchResults myFriends={myFriends} searchInput={searchInput} />
        <FriendRequests
          myFriendRequests={myFriendRequests}
          showFriendRequest={showFriendRequest}
          isMyPage={isMyPage}
        />
        <FriendList
          myFriends={myFriends}
          searchInput={searchInput}
          isMyPage={isMyPage}
        />
      </ContentDiv>
    </MyFriendsContentDiv>
  );
}
