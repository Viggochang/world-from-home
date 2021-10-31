import logo from "./logo.svg";
// import './App.css';
import React, { useEffect, useState, useRef } from "react";
import { Route, BrowserRouter, Switch, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { db_userInfo } from "./util/firebase";

import WelcomePage from "./pages/welcomPage/WelcomePage";
import HomePage from './pages/homePage/HomePage'
import World from "./pages/world/World";
import EditSpace from "./pages/edit/EditSpace";
import MyPage from "./pages/myPage/MyPage";
import UserPage from "./pages/userPage/UserPage";

const myUerId = "yXtnB3CD0XAJDQ0Le51J";

// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

function App() {
  // const query = useQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    db_userInfo
      .doc(myUerId)
      .onSnapshot(querySnapshot => {
        dispatch({
          type: "SET_USER_INFO",
          payload: querySnapshot.data(),
        });
      })

      // .then((doc) => {
      //   dispatch({
      //     type: "SET_USER_INFO",
      //     payload: doc.data(),
      //   });
      // });
  }, []);

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
          {/* <Route path="/edit"> 
            <EditSpace/>
          </Route> */}
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
