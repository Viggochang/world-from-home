import logo from './logo.svg';
// import './App.css';
import { Route, BrowserRouter, Switch } from "react-router-dom";
import db from "./util/firebase";

import WelcomePage from './pages/welcomPage/WelcomePage'
import World from './pages/world/World'
import EditSpace from './pages/edit/EditSpace'

function App() {
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
          <Route path="/edit"> 
            <EditSpace/>
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
