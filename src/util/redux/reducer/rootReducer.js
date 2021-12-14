import { combineReducers } from "redux";
import activeCanvas from "./activeCanvasReducer";
import activeObj from "./activeObjReducer";
import albumIdEditing from "./albumIdEditingReducer";
import albumIdShow from "./albumIdShowReducer";
import canvas from "./canvasReducer";
import canvasState from "./canvasStateReducer";
import editRedo from "./editRedoReducer";
import editUndo from "./editUndoReducer";
import myUserId from "./myUserIdProducer";
import pageInfo from "./pageInfoReducer";
import polygonSeries from "./polygonReducer";
import queryUserId from "./queryUserIdReducer";
import targetCountry from "./targetCountryReducer";
import userInfo from "./userInfoReducer";

const rootReducer = combineReducers({
  activeCanvas,
  activeObj,
  albumIdEditing,
  albumIdShow,
  canvas,
  canvasState,
  editRedo,
  editUndo,
  myUserId,
  pageInfo,
  polygonSeries,
  queryUserId,
  targetCountry,
  userInfo,
});

export default rootReducer;
