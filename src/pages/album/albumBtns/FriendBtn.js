import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import styled from "styled-components";
import MyTooltip from "../../../util/muiTooltips";

import { friendStateObj } from "../../../util/friendStateObj";
import { updateUser } from "../../../util/firebase";

const ButtonStyle = styled.div`
  margin-bottom: 30px;
  display: ${(props) => (props.isMyAlbum === "true" ? "none" : "flex")};
  justify-content: center;
  align-items: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  font-size: 30px;
  color: ${(props) =>
    props.friendCondition === "confirmed" ? "white" : "#3A4A58"};
  background-color: ${(props) =>
    props.friendCondition === "confirmed" ? "#3A4A58" : "white"};
  cursor: pointer;
  box-shadow: 0px 0px 10px #d0d0d0;
  @media (min-width: 1440px) {
    width: 80px;
    height: 80px;
    font-size: 36px;
  }
  :hover {
    box-shadow: 0px 0px 22px #d0d0d0;
  }
`;

const addFriendText = {
  none: "Add Friend",
  get_request: "Add Friend",
  send_request: "Request sent",
  confirmed: "You are Friend !",
};

export default function FriendBtn({ ownerData, isMyAlbum }) {
  const myInfo = useSelector((state) => state.userInfo);
  const [friendCondition, setFriendCondition] = useState("none");

  useEffect(() => {
    myInfo.friends.forEach((friend) => {
      if (ownerData.id === friend.id) {
        setFriendCondition(friend.condition);
      }
    });
  }, [ownerData]);

  function handleFriend() {
    if (friendCondition === "none" || friendCondition === "get_request") {
      const createUpdateBody = (
        myInfo,
        friendInfo,
        friendCondition,
        stateFrom
      ) => [
        ...myInfo.friends.filter((friend) => friend.id !== friendInfo.id),
        {
          id: friendInfo.id,
          condition: friendStateObj[friendCondition].state_change[stateFrom],
        },
      ];

      setFriendCondition(friendStateObj[friendCondition].state_change.my_state);
      updateUser(myInfo.id, {
        friends: createUpdateBody(
          myInfo,
          ownerData,
          friendCondition,
          "my_state"
        ),
      });
      updateUser(ownerData.id, {
        friends: createUpdateBody(
          ownerData,
          myInfo,
          friendCondition,
          "friend_state"
        ),
      });
    }
  }
  return (
    <MyTooltip
      style={{ fontSize: 18, opacity: 0.9 }}
      title={addFriendText[friendCondition]}
      placement="left"
      content={
        <ButtonStyle
          isMyAlbum={isMyAlbum.toString()}
          friendCondition={friendCondition}
          onClick={handleFriend}
        >
          {friendCondition === "confirmed" ? (
            <i className="fas fa-user-friends" />
          ) : (
            <i className="fas fa-user-plus" />
          )}
        </ButtonStyle>
      }
    ></MyTooltip>
  );
}
