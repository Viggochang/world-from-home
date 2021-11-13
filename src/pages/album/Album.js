import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { db_gallery, db_userInfo } from "../../util/firebase";

import ShowAlbum from "./component/ShowAlbum";
import { Tooltip, tooltipClasses } from "@mui/material";
import { styled as styledMui } from "@mui/material/styles";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "./alertButton.css";

import countryTrans from "../../util/countryTrans";

const MyTooltip = styledMui(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "rgb(255, 255, 255, 0.9)",
    color: "#3a4a58",
    boxShadow: theme.shadows[1],
    fontSize: 18,
    fontWeight: "bold",
  },
}));

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

const BackDiv = styled.div`
  position: fixed;
  top: 25px;
  right: 30px;
  color: #9d9d9d;
  font-weight: bold;
  font-size: 28px;
  cursor: pointer;
  :hover {
    color: white;
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
  width: 64px;
  height: 64px;
  border-radius: 50%;
  font-size: 30px;
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
    const MySwal = withReactContent(Swal);

    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        db_gallery.doc(albumIdShow).update({ condition: "discard" });
        MySwal.fire("Deleted!", "Your album has been deleted.", "success").then(
          (result) => {
            if (result.isConfirmed) {
              handleClickBack();
            }
          }
        );
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        MySwal.fire("Cancelled", "Your album is safe :)", "error");
      }
    });
  }

  const addFriendText = {
    none: "Add Friend",
    get_request: "Add Friend",
    send_request: "Request sended",
    confirmed: "You are Friend !",
  };

  return (
    <AlbumDiv style={{ display: albumIdShow ? "flex" : "none" }}>
      <BackDiv onClick={handleClickBack}>
        <i className="fas fa-times-circle" />
      </BackDiv>
      <ButtonsDiv>
        <MyTooltip
          title={liked ? "Liked" : "Like"}
          placement="left"
          sx={{ fontSize: "16px" }}
        >
          <ButtonStyle
            onClick={handleLike}
            style={liked ? { backgroundColor: "#3A4A58", color: "white" } : {}}
          >
            <i className="fas fa-thumbs-up" />
          </ButtonStyle>
        </MyTooltip>

        <MyTooltip title={addFriendText[friendCondition]} placement="left">
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
        </MyTooltip>

        <MyTooltip
          title="Edit"
          placement="left"
          style={{ display: isMyAlbun ? "flex" : "none" }}
        >
          <ButtonStyle onClick={handleEdit}>
            <i className="fas fa-pencil-alt" />
          </ButtonStyle>
        </MyTooltip>

        <MyTooltip
          title="Delete"
          placement="left"
          style={{ display: isMyAlbun ? "flex" : "none" }}
        >
          <ButtonStyle onClick={handleDelete}>
            <i className="fas fa-trash-alt"></i>
          </ButtonStyle>
        </MyTooltip>
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
