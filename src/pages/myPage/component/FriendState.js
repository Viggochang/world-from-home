import { style } from "@material-ui/system";
import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import { db_userInfo } from "../../../util/firebase";

const RequestBtnDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  bottom: 0px;
  left: 250px;
`;

const RequestBtn = styled.div`
  width: 75px;
  height: 75px;
  font-size: 40px;
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

export default function FriendState({ userInfo }) {
  const requestBtnRef = useRef();
  const stateTextRef = useRef();

  const [friendState, setFriendState] = useState("none");

  const myInfo = useSelector((state) => state.userInfo);
  const { id: friendId } = userInfo;
  const { friends: friendfriends } = userInfo;
  const { id: myId } = myInfo;
  const { friends: myFriends } = myInfo;

  // stateObj[stateObj[friendState].state_change.my_state].style
  const stateObj = {
    none: {
      text: "add friend",
      text_change: "send request",
      text_change_color: "green",
      style: {
        backgroundColor: "white",
        color: "#b8c3d0",
        outline: "1px #b8c3d0 solid",
      },
      state_change: {
        my_state: "send_request",
        friend_state: "get_request",
      },
    },
    send_request: {
      text: "request sended",
      text_change: "remove request",
      text_change_color: "red",
      style: {
        backgroundColor: "#b8c3d0",
        color: "white",
        outline: "1px white solid",
      },
      state_change: {
        my_state: "none",
        friend_state: "none",
      },
    },
    get_request: {
      text: "friend request",
      text_change: "accept request",
      text_change_color: "green",
      style: {
        backgroundColor: "#b8c3d0",
        color: "white",
        outline: "1px white solid",
      },
      state_change: {
        my_state: "confirmed",
        friend_state: "confirmed",
      },
    },
    confirmed: {
      text: "friend",
      text_change: "remove friend",
      text_change_color: "red",
      style: {
        backgroundColor: "#3A4A58",
        color: "white",
        outline: "1px white solid",
      },
      state_change: {
        my_state: "none",
        friend_state: "none",
      },
    },
  };

  useEffect(() => {
    if (myFriends) {
      const friendObj = myFriends.filter(({ id }) => id === friendId);
      setFriendState(
        friendObj.length &&
          Object.keys(stateObj).includes(friendObj[0].condition)
          ? friendObj[0].condition
          : "none"
      );
      console.log(friendObj.length ? friendObj[0].condition : "none");
    }
  }, [myFriends, friendId]);

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
    const stateChange = stateObj[friendState].state_change.my_state;
    console.log(stateChange);
    if (type === "leave") {
      style.color = stateObj[friendState].style.color;
      style.backgroundColor = stateObj[friendState].style.backgroundColor;
      style.outline = stateObj[friendState].style.outline;
      stateText.innerText = stateObj[friendState].text;
      stateText.style.color = 'white';
    } else if (type === "enter") {
      style.color = stateObj[stateChange].style.color;
      style.backgroundColor = stateObj[stateChange].style.backgroundColor;
      style.outline = stateObj[stateChange].style.outline;
      stateText.innerHTML = stateObj[friendState].text_change;
      stateText.style.color = stateObj[friendState].text_change_color;
    }
  }

  function handleFriendState() {
    const style = requestBtnRef.current.style;
    const stateText = stateTextRef.current;

    const stateChange = stateObj[friendState].state_change.my_state;
    style.color = stateObj[stateChange].style.color;
    style.backgroundColor = stateObj[stateChange].style.backgroundColor;
    style.outline = stateObj[stateChange].style.outline;
    stateText.style.color = 'white';

    setFriendState(stateChange);

    const myFriendsData = [
      ...myFriends.filter(({ id }) => id !== friendId),
      {
        id: friendId,
        condition: stateObj[friendState].state_change.my_state,
      },
    ];
    db_userInfo.doc(myId).update({ friends: myFriendsData });

    const friendFriendsData = [
      ...friendfriends.filter(({ id }) => id !== myId),
      {
        id: myId,
        condition: stateObj[friendState].state_change.friend_state,
      },
    ];
    db_userInfo.doc(friendId).update({ friends: friendFriendsData });
  }

  return (
    <RequestBtnDiv>
      <RequestBtn
        ref={requestBtnRef}
        style={stateObj[friendState].style}
        onMouseEnter={(e) => handleRequestBtn(e, "enter")}
        onMouseLeave={(e) => handleRequestBtn(e, "leave")}
        onClick={handleFriendState}
      >
        {friendState === "confirmed" ? (
          <i className="fas fa-user-friends" style={{ margin: "auto" }}></i>
        ) : (
          <i className="fas fa-user-plus" style={{ margin: "auto" }}></i>
        )}
      </RequestBtn>
      <StateText ref={stateTextRef}>{stateObj[friendState].text}</StateText>
    </RequestBtnDiv>
  );
}

// four states
// 1. no relationship in db: add friend
// 2. send_request in my db: request sended
// 3. get_request in my db: friend request (confirm / delete)
// 4. comfirm in db: friend