import logo from "./logo.svg";
// import './App.css';
import React, { useEffect, useState } from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { firebase, db_userInfo } from "./util/firebase";
import "firebase/auth";

import WelcomePage from "./pages/welcomPage/WelcomePage";
import HomePage from "./pages/homePage/HomePage";
import EditSpace from "./pages/edit/EditSpace";
import MyPage from "./pages/myPage/MyPage";
import UserPage from "./pages/userPage/UserPage";
import NotFound from "./pages/notFound/NotFound";

// const myUserId = "yXtnB3CD0XAJDQ0Le51J";

// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

function App() {
  // const query = useQuery();
  const dispatch = useDispatch();
  const myUserId = useSelector((state) => state.myUserId);
  const [mapType, setMapType] = useState(false);

  useEffect(() => {
    dispatch({
      type: "SET_ALBUM_ID_SHOW",
      payload: new URL(window.location).searchParams.get("album_id_show"),
    });
  }, []);

  //onAuthStateChanged
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // console.log(user);
      // if (firebase.auth().currentUser) {
      const { email } = user;
      db_userInfo
        .where("email", "==", email)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            const myUserId = doc.id;
            dispatch({
              type: "SET_MY_USER_ID",
              payload: myUserId,
            });
          });
        });
      // }
    }
  });

  useEffect(() => {
    if (myUserId) {
      console.log(myUserId);
      db_userInfo.doc(myUserId).onSnapshot((querySnapshot) => {
        dispatch({
          type: "SET_USER_INFO", // 使用者的資訊
          payload: querySnapshot.data() || {},
        });
      });
    }
  }, [myUserId]);

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
