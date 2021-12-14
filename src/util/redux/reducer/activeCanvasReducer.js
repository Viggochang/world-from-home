const activeCanvas = (state = {}, action) => {
  switch (action.type) {
    case "SET_ACTIVE_CANVAS":
      return action.payload;
    case "DELETE_ACTIVE_CANVAS":
      return {};
    default:
      return state;
  }
};

export default activeCanvas;
