const myUserId = (state = "", action) => {
  switch (action.type) {
    case "SET_MY_USER_ID":
      return action.payload;

    default:
      return state;
  }
};

export default myUserId;
