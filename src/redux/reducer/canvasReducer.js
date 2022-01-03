const canvas = (state = {}, action) => {
  switch (action.type) {
    case "SET_CANVAS":
      return { ...state, ...action.payload };
    case "DELETE_CANVAS":
      return {};
    default:
      return state;
  }
};

export default canvas;
