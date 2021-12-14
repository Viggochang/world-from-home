const activeObj = (state = {}, action) => {
  switch (action.type) {
    case "SET_ACTIVE_OBJ":
      return action.payload;
    case "DELETE_ACTIVE_OBJ":
      return {};
    default:
      return state;
  }
};

export default activeObj;
