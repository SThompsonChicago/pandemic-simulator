import React from "react";
import { Spring } from "react-spring";
import { HeatMapGrid } from "react-grid-heatmap";

const math = require('mathjs');

const n = 20;
const T = 10;

const a = math.zeros(n, n, T+1);

for(let i = 0; i < n; i++) {
  for(let j = 0; j < n; j++) {
    for (let k = 0; k < T+1; k++){
          a.subset(math.index(i, j, k), Math.random());
    }
  }
}

const xLabels = new Array(n).fill(0).map((_, i) => `${i}`);
const yLabels = new Array(n).fill(0).map((_, i) => `${i}`).reverse();

const data = new Array(yLabels.length)
  .fill(0)
  .map(() =>
    new Array(xLabels.length)
      .fill(0)
  );

export default function Counter() {
  return (
      <div>
            <Spring
              from={{ number: 0 }}
              to={{ number: T }}
              config={{ duration: T*500 }}
            >
              {props => (
                <div style={props}>
                  <div
      style={{
        width: "100%",
        fontFamily: "sans-serif"
      }}
    >
      <HeatMapGrid
        data={data}
        xLabels={xLabels}
        yLabels={yLabels}
        // Reder cell with tooltip
        cellRender={(x, y, value) => (
          <div title={`Pos(${x}, ${y}) = ${value}`}></div>
        )}
        xLabelsStyle={() => ({
          fontSize: ".65rem",
          textTransform: "uppercase",
          color: "#777"
        })}
        yLabelsStyle={() => ({
          fontSize: ".65rem",
          textTransform: "uppercase",
          color: "#777"
        })}
        cellStyle={(_x, _y, ratio) => ({
          background: `rgb(${a.subset(math.index(_x, _y, Math.floor(props.number.toFixed())))*255 }, 0, ${(1 - a.subset(math.index(_x, _y, Math.floor(props.number.toFixed()))))*255})`
        })}
        cellHeight="2rem"
        xLabelsPos="bottom"
        onClick={(x, y) => null}
        // yLabelsPos="right"
        // square
      />
    </div>
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
