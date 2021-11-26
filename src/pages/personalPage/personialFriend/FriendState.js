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
`;

const RequestBtn = styled.div`
  width: 70px;
  height: 70px;
  font-size: 36px;
  border-radius: 50%;
  display: flex;
  cursor: pointer;
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
    color: #ae0000; /*red*/
  }
`;

export default function FriendState({ userInfo }) {
  const requestBtnRef = useRef();
  const stateTextRef = useRef();

  const [friendState, setFriendState] = useState("none");

  const myInfo = useSelector((state) => state.userInfo);
  const { friends: friendFriends } = userInfo;
  const { friends: myFriends } = myInfo;

  // stateObj[stateObj[friendState].state_change.my_state].style

  useEffect(() => {
    if (myFriends) {
      const friendObj = myFriends.filter(({ id }) => id === userInfo.id);
      setFriendState(
        friendObj.length &&
          Object.keys(friendStateObj).includes(friendObj[0].condition)
          ? friendObj[0].condition
          : "none"
      );
      console.log(friendObj.length ? friendObj[0].condition : "none");
    }
  }, [myFriends, userInfo.id]);

  // function getStateObj(friendState) {
  //   if (Object.keys(stateObj).includes(friendState)) {
  //     return stateObj[friendState];
  //   } else {
  //     return stateObj["none"];
  //   }
  // }

  function handleRequestBtn(e, type) {
    const style = requestBtnRef.current.style;
    const stateText = stateTextRef.current;
    const stateChange = friendStateObj[friendState].state_change.my_state;
    console.log(stateChange);
    if (type === "leave") {
      style.color = friendStateObj[friendState].style.color;
      style.backgroundColor = friendStateObj[friendState].style.backgroundColor;
      style.outline = friendStateObj[friendState].style.outline;
      stateText.innerText = friendStateObj[friendState].text;
      stateText.style.color = "white";
    } else if (type === "enter") {
      style.color = friendStateObj[stateChange].style.color;
      style.backgroundColor = friendStateObj[friendState].color_change;
      style.outline = friendStateObj[stateChange].style.outline;
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
      stateText.style.color = "#AE0000"; //red
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
          <i className="fas fa-user-friends" style={{ margin: "auto" }} />
        ) : (
          <i className="fas fa-user-plus" style={{ margin: "auto" }} />
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
