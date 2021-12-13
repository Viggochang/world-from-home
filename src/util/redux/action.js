export const setPolygonseries = (polygonSeries) => {
  return {
    type: "SET_POLYGONSERIES",
    payload: polygonSeries,
  };
};

export const setMyUserId = (userId) => {
  return {
    type: "SET_MY_USER_ID",
    payload: userId,
  };
};

export const setQueryUserId = (queryUserId) => {
  return {
    type: "SET_QUERY_USER_ID",
    payload: queryUserId,
  };
};

export const setTargetCountry = (countryObj) => {
  return {
    type: "SET_TARGET_COUNTRY",
    payload: countryObj,
  };
};

export const setAlbumIdEditing = (albumId) => {
  return {
    type: "SET_ALBUM_ID_EDITING",
    payload: albumId,
  };
};

export const setCanvas = (canvas) => {
  return {
    type: "SET_CANVAS",
    payload: canvas,
  };
};

export const setPageInfo = (pageInfo) => {
  return {
    type: "SET_PAGE_INFO",
    payload: pageInfo,
  };
};

export const setCanvasState = (canvasState) => {
  return {
    type: "SET_CANVAS_STATE",
    payload: canvasState,
  };
};

export const setActiveCanvas = (activeCanvas) => {
  return {
    type: "SET_ACTIVE_CANVAS",
    payload: activeCanvas,
  };
};

export const setActiveObj = (activeObj) => {
  return {
    type: "SET_ACTIVE_OBJ",
    payload: activeObj,
  };
};

export const setEditUndo = (undo) => {
  return {
    type: "UNDO",
    payload: undo,
  };
};

export const setEditRedo = (redo) => {
  return {
    type: "REDO",
    payload: redo,
  };
};

export const removeCanvas = (remove) => {
  return {
    type: "REMOVE_CANVAS",
    payload: remove,
  };
};

export const discardCanvasEdit = () => {
  return {
    type: "DISCARD_CANVAS_EDIT",
    payload: "",
  };
};

export const setUserInfo = (UserInfo) => {
  return {
    type: "SET_USER_INFO",
    payload: UserInfo,
  };
};

export const setAlbumIdShow = (albumIdShow) => {
  return {
    type: "SET_ALBUM_ID_SHOW",
    payload: albumIdShow,
  };
};
