const queryUserId = (state = "", action) => {
  switch (action.type) {
    case "SET_QUERY_USER_ID":
      return action.payload;

    default:
      return state;
  }
};

export default queryUserId;
