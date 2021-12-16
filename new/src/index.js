import React from "react";
import ReactDOM from "react-dom";
import { Transition, animated } from "react-spring";
import Counter from "./components/Counter";
import Header from './components/Header';

import "./styles.css";

class App extends React.Component {

  render() {
    return (
      <div className="App">
        <Header />
        <Counter />
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
