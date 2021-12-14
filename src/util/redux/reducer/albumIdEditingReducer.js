const albumIdEditing = (state = "", action) => {
  switch (action.type) {
    case "SET_ALBUM_ID_EDITING":
      return action.payload;
    case "DELETE_ALBUM_ID_EDITING":
      return "";
    default:
      return state;
  }
};

export default albumIdEditing;
