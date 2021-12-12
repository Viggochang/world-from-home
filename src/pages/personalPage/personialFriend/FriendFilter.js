import React, { useRef } from "react";
import styled from "styled-components";

import InputBase from "@mui/material/InputBase";

import MyTooltip from "../../../util/muiTooltips";

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
  color: ${(props) => (props.request === "true" ? "white" : "#3a4a58")};
  font-size: 30px;
  border-radius: 50%;
  position: relative;
  display: flex;
  background-color: ${(props) =>
    props.request === "true"
      ? "rgb(58, 74, 88, 0.8)"
      : "rgb(255, 255, 255, 0.7)"};
  cursor: pointer;
  :hover {
    background-color: rgb(184, 195, 208, 0.7);
    color: white;
  }
  @media (max-width: 640px) {
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
`;

const SearchIconDiv = styled.div`
  font-size: 20px;
  position: absolute;
  right: 10px;
  top: calc(50% - 10px);
  color: #3a4a58;
`;

const FontIcon = styled.i`
  margin: auto;
`;

export default function FriendFilter({
  title,
  isMyPage,
  showFriendRequest,
  setShowFriendRequest,
  setSearchInput,
  myFriendRequests,
}) {
  const friendRequestsRef = useRef();

  function handleFriendRequest() {
    setShowFriendRequest((showFriendRequest) => !showFriendRequest);
  }

  function handleSearch(e) {
    const searchInput = e.target.value;
    setSearchInput(searchInput);
  }

  return (
    <FilterDiv>
      <Title>{title}</Title>
      {isMyPage && (
        <MyTooltip
          styleParams={{ fontSize: 14, opacity: 0.7 }}
          title="Friend Requests"
          placement="left"
          content={
            <RequestBtn
              ref={friendRequestsRef}
              request={showFriendRequest.toString()}
              onClick={handleFriendRequest}
            >
              <FontIcon className="fas fa-user-plus" />
              {!!myFriendRequests.length && (
                <RequestAlert>{myFriendRequests.length}</RequestAlert>
              )}
            </RequestBtn>
          }
        />
      )}
      <SearchInput>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          style={{ color: "#3a4a58" }}
          placeholder="Search Friends"
          inputProps={{ "aria-label": "search google maps" }}
          onChange={handleSearch}
        />
        <SearchIconDiv>
          <i className="fas fa-search" />
        </SearchIconDiv>
      </SearchInput>
    </FilterDiv>
  );
}
