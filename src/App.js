import React, { useEffect, useState } from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import { useDispatch } from "react-redux";
import { onAuthStateChanged, onSnapShotByUid } from "./util/firebase";
import "firebase/auth";
import { setMyUserId, setUserInfo } from "./redux/action";

import WelcomePage from "./pages/welcomPage/WelcomePage";
import HomePage from "./pages/homePage/HomePage";
import EditSpace from "./pages/edit/EditSpace";
import MyPage from "./pages/personalPage/MyPage";
import UserPage from "./pages/personalPage/UserPage";
import NotFound from "./pages/notFound/NotFound";

function App() {
  const dispatch = useDispatch();
  const [mapType, setMapType] = useState(false);

  useEffect(() => {
    async function dispatchUserData(user) {
      if (user) {
        onSnapShotByUid(user.uid, (user_info) => {
          dispatch(setUserInfo(user_info));
        });
        dispatch(setMyUserId(user.uid));
      }
    }
    onAuthStateChanged(dispatchUserData);
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <WelcomePage />
          </Route>
          <Route path="/home">
            <HomePage mapType={mapType} setMapType={setMapType} />
          </Route>
          <Route path="/mypage">
            <MyPage />
          </Route>
          <Route path="/user">
            <UserPage />
          </Route>
          <Route path="/edit">
            <EditSpace />
          </Route>
          <Route path="/notfound">
            <NotFound />
          </Route>
          <Route path="*" component={NotFound} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
