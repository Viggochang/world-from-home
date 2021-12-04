import { createStore } from "redux";

const data = {
  polygonSeries: {},
  myUserId: "",
  queryUserId: "",
  targetCountry: {},
  albumIdEditing: "",
  canvas: {},
  pageInfo: {},
  canvasState: {},
  activeCanvas: {},
  activeObj: {},
  editUndo: [],
  editRedo: [],
  userInfo: {},
  albumIdShow: "",
};

const rootReducer = (state = data, action) => {
  switch (action.type) {
    case "SET_POLYGONSERIES":
      return { ...state, polygonSeries: action.payload };
    case "SET_MY_USER_ID":
      return { ...state, myUserId: action.payload };
    case "SET_QUERY_USER_ID":
      return { ...state, queryUserId: action.payload };
    case "SET_TARGET_COUNTRY":
      return { ...state, targetCountry: action.payload };
    case "SET_ALBUM_ID_EDITING":
      return { ...state, albumIdEditing: action.payload };
    case "SET_CANVAS":
      return { ...state, canvas: { ...state.canvas, ...action.payload } };
    case "SET_PAGE_INFO":
      return { ...state, pageInfo: { ...state.pageInfo, ...action.payload } };
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
        canvasId: { ...state.canvasId, ...action.payload },
      };
    // discard album編輯
    case "DISCARD_CANVAS_EDIT":
      return {
        ...state,
        targetCountry: {},
        albumIdEditing: "",
        canvas: {},
        pageInfo: {},
        canvasState: {},
        activeCanvas: {},
        activeObj: {},
        editUndo: [],
        editRedo: [],
      };
    case "SET_USER_INFO":
      return {
        ...state,
        userInfo: action.payload,
      };
    case "SET_ALBUM_ID_SHOW":
      return {
        ...state,
        albumIdShow: action.payload,
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
