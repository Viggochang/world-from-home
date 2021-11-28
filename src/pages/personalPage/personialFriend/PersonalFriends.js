import React, { useState, useEffect } from "react";

import styled from "styled-components";

import FriendFilter from "./FriendFilter";
import FriendSearchResults from "./FriendSearchResults";
import FriendRequests from "./FriendRequests";
import FriendList from "./FriendList";

import { onSnapshotMyFriend } from "../../../util/firebase";

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

const ContentDiv = styled.div`
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

export default function PersonalFriends({ title, userInfo, isMyPage }) {
  const [myFriends, setMyFriends] = useState([]);
  const [myFriendRequests, setMyFriendRequests] = useState([]);
  const [searchInput, setSearchInput] = useState();
  const [showFriendRequest, setShowFriendRequest] = useState(false);
  const { id } = userInfo;

  useEffect(() => {
    if (id) {
      onSnapshotMyFriend(id, "confirmed", setMyFriends);
      onSnapshotMyFriend(id, "send_request", setMyFriendRequests);
    }
  }, [id]);

  return (
    <MyFriendsContentDiv>
      <FriendFilter
        title={title}
        isMyPage={isMyPage}
        showFriendRequest={showFriendRequest}
        setShowFriendRequest={setShowFriendRequest}
        setSearchInput={setSearchInput}
        myFriendRequests={myFriendRequests}
      />

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
