import { createStore } from "redux";

const data = {
  targetCountry: {},
  canvas: {},
  pageInfo: {},
  canvasState: {},
  activeCanvas: {},
  activeObj: {},
  editUndo: [],
  editRedo: [],
};

const rootReducer = (state = data, action) => {
  console.log(state);
  switch (action.type) {
    case "SET_TARGET_COUNTRY":
      return { ...state, targetCountry: action.payload };
    case "SET_CANVAS":
      return { ...state, canvas: { ...state.canvas, ...action.payload } };
    case "SET_PAGE_INFO":
      return { ...state, pageInfo: {...state.pageInfo, ...action.payload} };
    case "SET_CANVAS_STATE":
      return {
        ...state,
        canvasState: { ...state.canvasState, ...action.payload },
      };
    case "SET_ACTIVE_CANVAS":
      return { ...state, activeCanvas: action.payload };
    case "SET_ACTIVE_OBJ":
      return { ...state, activeObj: action.payload };
    case "UNDO":
      return { ...state, editUndo: action.payload };
    case "REDO":
      return { ...state, editRedo: action.payload };
    case "REMOVE_CANVAS":
      return {
        ...state,
        canvasId: {...state.canvasId, ...action.payload}
      };
    default:
      return state;
  }
};

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
