import React from "react";
import ReactDOM from "react-dom";
import { Transition, animated } from "react-spring";
import Simulate from "./components/Simulate";
import Header from './components/Header';
import Footer from './components/Footer';

import "./styles.css";

class App extends React.Component {

  render() {
    return (
      <div className="App">
        <Header />
        <Simulate />
        <Footer />
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
