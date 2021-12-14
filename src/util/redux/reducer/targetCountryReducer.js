const targetCountry = (state = {}, action) => {
  switch (action.type) {
    case "SET_TARGET_COUNTRY":
      return action.payload;
    case "DELETE_TARGET_COUNTRY":
      return {};
    default:
      return state;
  }
};

export default targetCountry;
