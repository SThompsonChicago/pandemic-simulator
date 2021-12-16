import React from "react";
import { Spring } from "react-spring";

function square (a) {
  return a * a;
}

export default function Counter() {
  return (
      <div>
            <Spring
              from={{ number: 0 }}
              to={{ number: 30 }}
              config={{ duration: 4000 }}
            >
              {props => (
                <div style={props}>
                  <h1 style={counter}>{square(props.number.toFixed())}</h1>
                </div>
              )}
            </Spring>
          </div>
  );
}

const style = {
  background: "white",
  color: "black",
  padding: "1.5rem"
};

const counter = {
  background: "white",
  textAlign: "center",
  width: "100px",
  borderRadius: "50%",
  margin: "1rem auto"
};
