import React from "react";
import styled from "styled-components";

import Friend from "./Friend";

const FriendRequeststDiv = styled.div`
  border-bottom: 1px #3a4a58 solid;
  margin-bottom: -1px;
  width: 100%;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
`;

const ResultTitle = styled.div`
  font-size: 36px;
  font-weight: bold;
  margin: auto;
  margin-bottom: 30px;
  color: #3a4a58;
  text-align: center;
`;

const FriendRequestsContent = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export default function FriendRequests({ myFriendRequests, showFriendRequest }) {

  return (
    <FriendRequeststDiv
      style={{ display: showFriendRequest ? "flex" : "none" }}
    >
      <ResultTitle>
        {myFriendRequests.length ? "Friend Requests" : "No Friend Requests!"}
      </ResultTitle>
      <FriendRequestsContent>
        {myFriendRequests.map((friend) => (
          <Friend key={friend.id} friend={friend} request={true}/>
        ))}
      </FriendRequestsContent>
    </FriendRequeststDiv>
  );
}
