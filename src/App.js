import logo from './logo.svg';
// import './App.css';
import db from "./util/firebase";

import WelcomePage from './pages/welcomPage/WelcomePage'

function App() {
  return (
    <div className="App">
      <WelcomePage/>
    </div>
  );
}

export default App;
