const editRedo = (state = [], action) => {
  switch (action.type) {
    case "REDO":
      return action.payload;
    case "DELETE_REDO":
      return [];
    default:
      return state;
  }
};

export default editRedo;
