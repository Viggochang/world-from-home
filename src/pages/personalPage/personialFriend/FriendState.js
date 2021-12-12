import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import { updateUser } from "../../../util/firebase";
import { friendStateObj } from "../../../util/friendStateObj";

const RequestBtnDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  bottom: 0px;
  left: 620px;
  @media (max-width: 1180px) {
    left: 500px;
  }
  @media (max-width: 932px) {
    left: calc(56% + 80px);
  }
  @media (max-width: 500px) {
    left: calc(56% + 20px);
  }
`;

const RequestBtn = styled.div`
  width: 70px;
  height: 70px;
  font-size: 36px;
  border-radius: 50%;
  display: flex;
  cursor: pointer;
  @media (max-width: 500px) {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
`;
const FontIcon = styled.i`
  margin: auto;
`;

const StateText = styled.div`
  width: 125px;
  text-align: center;
  font-size: 16px;
  margin-top: 2px;
  color: white;
`;
const RemoveRequest = styled.div`
  font-size: 20px;
  position: absolute;
  right: 0;
  bottom: 20px;
  cursor: pointer;
  :hover {
    color: #ae0000;
  }
`;

export default function FriendState({ userInfo }) {
  const requestBtnRef = useRef();
  const stateTextRef = useRef();

  const [friendState, setFriendState] = useState("none");

  const myInfo = useSelector((state) => state.userInfo);
  const { friends: myFriends } = myInfo;

  useEffect(() => {
    if (myFriends) {
      const friendObj = myFriends.filter(({ id }) => id === userInfo.id);
      setFriendState(
        friendObj.length &&
          Object.keys(friendStateObj).includes(friendObj[0].condition)
          ? friendObj[0].condition
          : "none"
      );
    }
  }, [myFriends, userInfo.id]);

  function handleRequestBtn(e, type) {
    const btnStyle = requestBtnRef.current.style;
    const stateText = stateTextRef.current;
    const stateChange = friendStateObj[friendState].state_change.my_state;
    if (type === "leave") {
      btnStyle.color = friendStateObj[friendState].style.color;
      btnStyle.backgroundColor =
        friendStateObj[friendState].style.backgroundColor;
      btnStyle.outline = friendStateObj[friendState].style.outline;
      stateText.innerText = friendStateObj[friendState].text;
      stateText.style.color = "white";
    } else if (type === "enter") {
      btnStyle.color = friendStateObj[stateChange].style.color;
      btnStyle.backgroundColor = friendStateObj[friendState].color_change;
      btnStyle.outline = friendStateObj[stateChange].style.outline;
      stateText.innerText = friendStateObj[friendState].text_change;
      stateText.style.color = friendStateObj[friendState].color_change;
    }
  }

  const createUpdateBody = (myInfo, friendInfo, friendCondition, stateFrom) => [
    ...myInfo.friends.filter((friend) => friend.id !== friendInfo.id),
    {
      id: friendInfo.id,
      condition: friendStateObj[friendCondition].state_change[stateFrom],
    },
  ];

  function handleFriendState() {
    const style = requestBtnRef.current.style;
    const stateText = stateTextRef.current;

    const stateChange = friendStateObj[friendState].state_change.my_state;
    style.color = friendStateObj[stateChange].style.color;
    style.backgroundColor = friendStateObj[stateChange].style.backgroundColor;
    style.outline = friendStateObj[stateChange].style.outline;
    stateText.style.color = "white";

    setFriendState(stateChange);

    updateUser(myInfo.id, {
      friends: createUpdateBody(myInfo, userInfo, friendState, "my_state"),
    });
    updateUser(userInfo.id, {
      friends: createUpdateBody(userInfo, myInfo, friendState, "friend_state"),
    });
  }

  function handleRemoveRequesState() {
    const stateText = stateTextRef.current;
    stateText.style.color = "white";

    setFriendState("none");

    updateUser(myInfo.id, {
      friends: createUpdateBody(myInfo, userInfo, "remove", "my_state"),
    });
    updateUser(userInfo.id, {
      friends: createUpdateBody(userInfo, myInfo, "remove", "friend_state"),
    });
  }

  function handleRemoveRequest(e, type) {
    const stateText = stateTextRef.current;
    if (type === "enter") {
      stateText.innerText = "remove request";
      stateText.style.color = "#AE0000";
    }
  }

  return (
    <RequestBtnDiv>
      <RequestBtn
        ref={requestBtnRef}
        style={friendStateObj[friendState].style}
        onMouseEnter={(e) => handleRequestBtn(e, "enter")}
        onMouseLeave={(e) => handleRequestBtn(e, "leave")}
        onClick={handleFriendState}
      >
        {friendState === "confirmed" ? (
          <FontIcon className="fas fa-user-friends" />
        ) : (
          <FontIcon className="fas fa-user-plus" />
        )}
      </RequestBtn>
      <StateText ref={stateTextRef}>
        {friendStateObj[friendState].text}
      </StateText>
      {friendState === "get_request" ? (
        <RemoveRequest
          onMouseEnter={(e) => handleRemoveRequest(e, "enter")}
          onMouseLeave={(e) => handleRequestBtn(e, "leave")}
          onClick={handleRemoveRequesState}
        >
          <i className="fas fa-minus-circle" />
        </RemoveRequest>
      ) : (
        <></>
      )}
    </RequestBtnDiv>
  );
}
