const editUndo = (state = [], action) => {
  switch (action.type) {
    case "UNDO":
      return action.payload;
    case "DELETE_UNDO":
      return [];
    default:
      return state;
  }
};

export default editUndo;
