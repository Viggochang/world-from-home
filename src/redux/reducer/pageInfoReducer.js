const pageInfo = (state = {}, action) => {
  switch (action.type) {
    case "SET_PAGE_INFO":
      return { ...state, ...action.payload };
    case "DELETE_PAGE_INFO":
      return {};
    default:
      return state;
  }
};

export default pageInfo;
