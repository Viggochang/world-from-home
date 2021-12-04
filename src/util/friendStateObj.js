const friendStateObj = {
  none: {
    text: "add friend",
    text_change: "send request",
    color_change: "#b8c3d0", //green
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
    text: "request sent",
    text_change: "remove request",
    color_change: "#AE0000", //red
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
    color_change: "#3A4A58", //green
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
    color_change: "#AE0000", //red
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
  remove: {
    state_change: {
      my_state: "none",
      friend_state: "none",
    },
  },
};

export { friendStateObj };
