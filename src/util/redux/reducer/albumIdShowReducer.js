const albumIdShow = (state = "", action) => {
  switch (action.type) {
    case "SET_ALBUM_ID_SHOW":
      return action.payload;
    default:
      return state;
  }
};

export default albumIdShow;
