import logo from './logo.svg';
// import './App.css';
import { Route, BrowserRouter, Switch } from "react-router-dom";
import db from "./util/firebase";

import WelcomePage from './pages/welcomPage/WelcomePage'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <WelcomePage/>
          </Route>
          <Route path="/home"> 

          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
