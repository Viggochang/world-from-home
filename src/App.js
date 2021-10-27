import logo from './logo.svg';
// import './App.css';
import { Route, BrowserRouter, Switch } from "react-router-dom";
import { useDispatch } from "react-redux";
import {db_userInfo} from "./util/firebase";

import WelcomePage from './pages/welcomPage/WelcomePage'
// import HomePage from './pages/homePage/HomePage'
import World from './pages/world/World'
import EditSpace from './pages/edit/EditSpace'
import MyPage from './pages/myPage/MyPage';

function App() {
  const dispatch = useDispatch();
  db_userInfo.doc('yXtnB3CD0XAJDQ0Le51J').get().then(doc => {
    dispatch({
      type: 'SET_USER_INFO',
      payload: doc.data()
    });
  });

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <WelcomePage/>
          </Route>
          <Route path="/home"> 
            <World/>
          </Route>
          <Route path="/mypage"> 
            <MyPage/>
          </Route>
          {/* <Route path="/setting"> 
            <Setting/>
          </Route> */}
          {/* <Route path="/edit"> 
            <EditSpace/>
          </Route> */}
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
