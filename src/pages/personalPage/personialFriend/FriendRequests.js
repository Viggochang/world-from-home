import React from "react";
import styled from "styled-components";

import Friend from "./Friend";

const FriendRequeststDiv = styled.div`
  border-bottom: 1px #3a4a58 solid;
  margin-bottom: -1px;
  width: 100%;
  margin-bottom: 30px;
  flex-direction: column;
  display: ${(props) => (props.showFriendRequest === "true" ? "flex" : "none")};
`;

const ResultTitle = styled.div`
  font-size: 36px;
  font-weight: bold;
  margin: auto;
  margin-bottom: 30px;
  color: #3a4a58;
  text-align: center;
  @media (max-width: 1180px) {
    font-size: 24px;
  }
`;

const FriendRequestsContent = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export default function FriendRequests({
  myFriendRequests,
  showFriendRequest,
  isMyPage,
}) {
  return (
    <FriendRequeststDiv showFriendRequest={showFriendRequest.toString()}>
      <ResultTitle>
        {myFriendRequests.length ? "Friend Requests" : "No Friend Requests!"}
      </ResultTitle>
      <FriendRequestsContent>
        {myFriendRequests.map((friend) => (
          <Friend
            key={friend.id}
            friend={friend}
            request={true}
            isMyPage={isMyPage}
          />
        ))}
      </FriendRequestsContent>
    </FriendRequeststDiv>
  );
}
