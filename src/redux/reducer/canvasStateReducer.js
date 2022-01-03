const canvasState = (state = {}, action) => {
  switch (action.type) {
    case "SET_CANVAS_STATE":
      return { ...state, ...action.payload };
    case "DELETE_CANVAS_STATE":
      return {};
    default:
      return state;
  }
};

export default canvasState;
