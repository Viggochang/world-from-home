import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { useHistory } from "react-router";

import Button from "@material-ui/core/Button";

import countryTrans from "../../../util/countryTrans";
import { updateUser } from "../../../util/firebase";
import { friendStateObj } from "../../../util/friendStateObj";

const FriendDiv = styled.div`
  display: flex;
  width: 50%;
  margin-bottom: 30px;
  @media (max-width: 1180px) {
    width: 100%;
  }
  @media (max-width: 480px) {
    margin-bottom: 15px;
  }
`;
const FriendPhoto = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  box-shadow: 4px 4px 20px #4f4f4f;
  cursor: pointer;
  :hover {
    box-shadow: 4px 4px 20px #3c3c3c;
  }
  @media (max-width: 1180px) {
    margin-left: 50px;
  }
  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
  }
  @media (max-width: 480px) {
    margin-left: 30px;
  }
`;
const FriendMask = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  :hover {
    background-color: rgb(225, 225, 225, 0.2);
  }
`;

const FriendInfo = styled.div`
  margin-left: 30px;
  display: flex;
  flex-direction: column;
  color: #3a4a58;
  width: calc(100% - 130px);
  height: 100px;
  position: relative;
  @media (max-width: 1180px) {
    width: calc(100% - 180px);
  }
`;
const FriendName = styled.div`
  font-size: 36px;
  font-weight: bold;
  cursor: pointer;
  @media (max-width: 480px) {
    font-size: 24px;
  }
`;
const FriendCountry = styled.div`
  font-size: 20px;
  line-height: 30px;
  margin-bottom: 5px;
  @media (max-width: 480px) {
    font-size: 12px;
    line-height: 20px;
  }
`;

const AcceptRemoveBtnsDiv = styled.div`
  display: flex;
`;

export default function Friend({ friend: friendInfo, request, isMyPage }) {
  const acceptRef = useRef();
  const removeRef = useRef();
  const history = useHistory();
  const dispatch = useDispatch();

  const myInfo = useSelector((state) => state.userInfo);

  function handleAcceptRemove(e, friendCondition) {
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

    updateUser(myInfo.id, {
      friends: createUpdateBody(
        myInfo,
        friendInfo,
        friendCondition,
        "my_state"
      ),
    });
    updateUser(friendInfo.id, {
      friends: createUpdateBody(
        friendInfo,
        myInfo,
        friendCondition,
        "friend_state"
      ),
    });
  }

  function handleQueryUserId() {
    dispatch({
      type: "SET_QUERY_USER_ID",
      payload: friendInfo.id,
    });
    history.push({ pathname: "user", search: `?id=${friendInfo.id}` });
  }

  return (
    <FriendDiv>
      <FriendPhoto
        style={{
          background: `url(${friendInfo.photo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        onClick={handleQueryUserId}
      >
        <FriendMask />
      </FriendPhoto>
      <FriendInfo>
        <FriendName onClick={handleQueryUserId}>{friendInfo.name}</FriendName>
        <FriendCountry>
          <i className="fas fa-globe" />{" "}
          {friendInfo.country ? countryTrans[friendInfo.country].name_en : ""}
        </FriendCountry>
        {isMyPage ? (
          <AcceptRemoveBtnsDiv>
            {request ? (
              <Button
                ref={acceptRef}
                onClick={(e) => handleAcceptRemove(e, "get_request")}
                sx={{
                  outline: "1px	#006000 solid",
                  color: "#006000",
                  padding: "0 10px",
                  borderRadius: "20px",
                  marginRight: "15px",
                  fontSize: "12px",
                  "&:hover": {
                    backgroundColor: "#006000",
                    color: "white",
                  },
                }}
              >
                accept
              </Button>
            ) : (
              <></>
            )}
            <Button
              ref={removeRef}
              onClick={(e) => handleAcceptRemove(e, "confirmed")}
              sx={{
                outline: "1px #AE0000 solid",
                color: "#AE0000",
                padding: "0 10px",
                borderRadius: "20px",
                marginRight: "15px",
                fontSize: "12px",
                "&:hover": {
                  backgroundColor: "#AE0000",
                  color: "white",
                },
              }}
            >
              remove
            </Button>
          </AcceptRemoveBtnsDiv>
        ) : (
          <></>
        )}
      </FriendInfo>
    </FriendDiv>
  );
}
