import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { db_gallery, db_userInfo } from "../../util/firebase";

import ShowAlbum from "./component/ShowAlbum";
import { Tooltip } from "@mui/material";
import { Alert, Stack } from "@mui/material";

import countryTrans from "../../util/countryTrans";

const AlbumDiv = styled.div`
  width: calc(100vw - 200px);
  height: calc(100vh - 80px);
  background-color: rgb(0, 0, 0, 0.85);
  display: none;
  z-index: 5;
  position: fixed;
  top: 0;
  left: 0;
  flex-direction: column;
  padding: 40px 100px;
  overflow: scroll;
`;

const AlertDiv = styled.div`
  margin: 20px calc(50% - 150px);
  position: relative;
`;

const BackDiv = styled.div`
  position: fixed;
  top: 25px;
  right: 30px;
  color: white;
  font-weight: bold;
  font-size: 25px;
  cursor: pointer;
  :hover {
    color: #b8c3d0;
  }
`;

const ButtonsDiv = styled.div`
  position: fixed;
  top: 150px;
  right: 50px;
  display: flex;
  flex-direction: column;
`;

const ButtonStyle = styled.div`
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  font-size: 25px;
  color: #3a4a58;
  background-color: white;
  cursor: pointer;
  box-shadow: 0px 0px 10px #d0d0d0;
  :hover {
    /* color: #667484; */
    box-shadow: 0px 0px 22px #d0d0d0;
  }
`;

const AlbumInfo = styled.div`
  display: flex;
  align-items: center;
`;

const AlbumOwner = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 10px;
  cursor: pointer;
`;

const AlbumPositionData = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
`;

const AlbumPosition = styled.div`
  margin-left: 5px;
  font-weight: bold;
  font-size: 30px;
  line-height: 40px;
`;

const AlbumDate = styled.div`
  margin-left: 5px;
  font-size: 20px;
  line-height: 30px;
`;

export default function Album() {
  const albumIdShow = useSelector((state) => state.albumIdShow);
  const myInfo = useSelector((state) => state.userInfo);
  const history = useHistory();
  const dispatch = useDispatch();
  const [albumData, setAlbumData] = useState({});
  const [ownerPhoto, setOwnerPhoto] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [ownerFriendData, setOwnerFriendData] = useState([]);
  const [liked, setLiked] = useState(false);
  const [friendCondition, setFriendCondition] = useState("none");
  const [isMyAlbun, setIsMyAlbum] = useState(false);
  const deleteAlertRef = useRef();

  const { content, position, timestamp, user_id } = albumData || {};

  useEffect(() => {
    console.log(albumIdShow);
    if (albumIdShow) {
      db_gallery
        .doc(albumIdShow)
        .get()
        .then((doc) => {
          let albumData = doc.data();
          setAlbumData(albumData);
          db_userInfo
            .doc(albumData.user_id)
            .get()
            .then((doc) => {
              setOwnerPhoto(doc.data().photo);
              setOwnerId(doc.data().id);
              setOwnerFriendData(doc.data().friends);
            });
        });
    }
  }, [albumIdShow]);

  useEffect(() => {
    if (albumData.praise) {
      setLiked(albumData.praise.includes(myInfo.id));
    }
  }, [albumData.praise]);

  useEffect(() => {
    if (myInfo.friends) {
      myInfo.friends.forEach((friend) => {
        if (ownerId === friend.id) {
          setFriendCondition(friend.condition);
        }
      });
    }
    setIsMyAlbum(myInfo.id === ownerId);
  }, [myInfo.friends, ownerId]);

  function handleClickBack() {
    let params = new URL(window.location).searchParams;
    params.delete("album_id_show");
    history.push({
      search: params.toString(),
    });

    dispatch({ type: "SET_ALBUM_ID_SHOW", payload: "" });
    setAlbumData({});
    setOwnerPhoto("");
    setOwnerId("");
  }

  function handleLike() {
    setLiked(!liked);
    db_gallery.doc(albumIdShow).update({
      praise: !liked
        ? [...albumData.praise, myInfo.id]
        : albumData.praise.filter((id) => id !== myInfo.id),
    });
  }

  function handleFriend() {
    const newMyFriendData = myInfo.friends.filter(
      (friend) => friend.id !== ownerId
    );
    const newOwnerFriendData = ownerFriendData.filter(
      (friend) => friend.id !== myInfo.id
    );

    if (friendCondition === "none") {
      db_userInfo.doc(myInfo.id).update({
        friends: [
          ...newMyFriendData,
          { id: ownerId, condition: "send_request" },
        ],
      });
      db_userInfo.doc(ownerId).update({
        friends: [
          ...newOwnerFriendData,
          { id: myInfo.id, condition: "get_request" },
        ],
      });
    } else if (friendCondition === "get_request") {
      db_userInfo.doc(myInfo.id).update({
        friends: [...newMyFriendData, { id: ownerId, condition: "confirmed" }],
      });
      db_userInfo.doc(ownerId).update({
        friends: [
          ...newOwnerFriendData,
          { id: myInfo.id, condition: "confirmed" },
        ],
      });
    }
  }

  function handleEdit() {
    dispatch({
      type: "SET_ALBUM_ID_SHOW",
      payload: "",
    });
    dispatch({
      type: "SET_TARGET_COUNTRY",
      payload: {
        id: albumData.country,
        name: countryTrans[albumData.country].name_en,
      },
    });
    history.push({
      pathname: "edit",
      search: `?album_id_edit=${albumIdShow}`,
    });
  }

  function handleDelete() {
    db_gallery.doc(albumIdShow).update({ condition: "discard" });
    deleteAlertRef.current.style.display = "flex";
    setTimeout(() => {
      deleteAlertRef.current.style.display = "none";
      handleClickBack();
    }, 1000);
  }

  const addFriendText = {
    none: "Add Friend",
    get_request: "Add Friend",
    send_request: "Request sended",
    confirmed: "You are Friend !",
  };

  return (
    <AlbumDiv style={{ display: albumIdShow ? "flex" : "none" }}>
      <AlertDiv>
        <Stack sx={{ width: "300px" }} spacing={2}>
          <Alert
            severity="error"
            style={{ position: "absolute", margin: 0, display: "none" }}
            ref={deleteAlertRef}
          >
            Album Deleted !
          </Alert>
        </Stack>
      </AlertDiv>
      <BackDiv onClick={handleClickBack}>
        <i className="fas fa-times"></i>
      </BackDiv>
      <ButtonsDiv>
        <Tooltip title={liked ? "Liked" : "Like"} placement="left">
          <ButtonStyle
            onClick={handleLike}
            style={liked ? { backgroundColor: "#3A4A58", color: "white" } : {}}
          >
            <i className="fas fa-thumbs-up" />
          </ButtonStyle>
        </Tooltip>

        <Tooltip title={addFriendText[friendCondition]} placement="left">
          <ButtonStyle
            onClick={handleFriend}
            style={
              friendCondition === "confirmed"
                ? {
                    backgroundColor: "#3A4A58",
                    color: "white",
                    display: isMyAlbun ? "none" : "flex",
                  }
                : { display: isMyAlbun ? "none" : "flex" }
            }
          >
            <i className="fas fa-user-plus"></i>
          </ButtonStyle>
        </Tooltip>

        <Tooltip
          title="Edit"
          placement="left"
          style={{ display: isMyAlbun ? "flex" : "none" }}
        >
          <ButtonStyle onClick={handleEdit}>
            <i className="fas fa-pencil-alt" />
          </ButtonStyle>
        </Tooltip>

        <Tooltip
          title="Delete"
          placement="left"
          style={{ display: isMyAlbun ? "flex" : "none" }}
        >
          <ButtonStyle onClick={handleDelete}>
            <i className="fas fa-trash-alt"></i>
          </ButtonStyle>
        </Tooltip>
      </ButtonsDiv>

      <AlbumInfo>
        <AlbumOwner
          style={{
            backgroundImage: `url(${ownerPhoto})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          onClick={() => {
            dispatch({
              type: "SET_ALBUM_ID_SHOW",
              payload: "",
            });
            history.push({
              pathname: "user",
              search: `?id=${albumData.user_id}`,
            });
          }}
        />
        <AlbumPositionData>
          <AlbumPosition>
            <i className="fas fa-map-pin" />
            &ensp;{albumData.position}
          </AlbumPosition>
          <AlbumDate>
            <i className="far fa-calendar-alt" />
            &ensp;
            {albumData.timestamp
              ? new Date(albumData.timestamp.seconds * 1000).toDateString()
              : ""}
          </AlbumDate>
        </AlbumPositionData>
      </AlbumInfo>
      <ShowAlbum show={true} albumContent={albumData.content} />
    </AlbumDiv>
  );
}
