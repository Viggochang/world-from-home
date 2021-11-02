import logo from "./logo.svg";
// import './App.css';
import React, { useEffect, useState, useRef } from "react";
import { Route, BrowserRouter, Switch, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { firebase, db_userInfo } from "./util/firebase";
import "firebase/auth";

import WelcomePage from "./pages/welcomPage/WelcomePage";
import HomePage from "./pages/homePage/HomePage";
import World from "./pages/world/World";
import EditSpace from "./pages/edit/EditSpace";
import MyPage from "./pages/myPage/MyPage";
import UserPage from "./pages/userPage/UserPage";

// const myUserId = "yXtnB3CD0XAJDQ0Le51J";

// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

function App() {
  // const query = useQuery();
  const dispatch = useDispatch();
  const myUserId = useSelector((state) => state.myUserId);

  useEffect(() => {
    console.log(firebase.auth().currentUser);
    if (firebase.auth().currentUser) {
      const { email } = firebase.auth().currentUser;
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
    }
  }, []);

  useEffect(() => {
    if (myUserId) {
      console.log(myUserId);
      db_userInfo.doc(myUserId).onSnapshot((querySnapshot) => {
        dispatch({
          type: "SET_USER_INFO",
          payload: querySnapshot.data(),
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
            <HomePage />
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
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
