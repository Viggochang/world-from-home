const polygonSeries = (state = {}, action) => {
  switch (action.type) {
    case "SET_POLYGONSERIES":
      return action.payload;

    default:
      return state;
  }
};

export default polygonSeries;
