import React from "react";
import styled from "styled-components";

import Friend from "./Friend";

const FriendSearchResultsDiv = styled.div`
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

const FriendSearchResultsContent = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export default function FriendSearchResults({ myFriends, searchInput }) {
  return myFriends.length && searchInput ? (
    <FriendSearchResultsDiv>
      {myFriends.filter(({ name }) =>
        name.toLowerCase().includes(searchInput.toLowerCase())
      ).length ? (
        <>
          <ResultTitle>Results</ResultTitle>
          <FriendSearchResultsContent>
            {myFriends
              .filter(({ name }) =>
                name.toLowerCase().includes(searchInput.toLowerCase())
              )
              .map((friend) => {
                return <Friend key={friend.id} friend={friend} />;
              })}
          </FriendSearchResultsContent>
        </>
      ) : (
        <ResultTitle>No Results！</ResultTitle>
      )}
    </FriendSearchResultsDiv>
  ) : (
    <></>
  );
}
