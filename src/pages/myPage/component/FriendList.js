import React from "react";
import styled from "styled-components";

import Friend from "./Friend";

const FriendListDiv = styled.div`
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
  @media (max-width: 1180px) {
    font-size: 24px;
  }
`;

const FriendListContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  @media (max-width: 1180px) {
    flex-direction: column;
    /* align-items: center; */
  }
`;

export default function FriendList({ myFriends, searchInput, isMyPage }) {
  return (
    <FriendListDiv>
      <ResultTitle>
        {myFriends.length ? "Friends From The World！" : "No Friends"}
      </ResultTitle>
      <FriendListContent>
        {myFriends
          .filter(
            ({ name }) =>
              !searchInput ||
              !name.toLowerCase().includes(searchInput.toLowerCase())
          )
          .map((friend) => (
            <Friend key={friend.id} friend={friend} isMyPage={isMyPage} />
          ))}
      </FriendListContent>
    </FriendListDiv>
  );
}
