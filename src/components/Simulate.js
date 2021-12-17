import React from "react";
import { Spring } from "react-spring";
import { HeatMapGrid } from "react-grid-heatmap";


const math = require('mathjs');


const T = 50;

// Superdiffusion parameter
const mu = 0.6;

// Transmission rate
const alpha = 0.5;

// Recovery rate
const beta = 0.1;

// Number of rows in the grid
const n = 5;

// Number of nodes in the transportation network
const N = n * n;

// Step size for ODE solver
const h = 0.01;

// Number of time intervals
const periods = 12000;

// The "diffusion" coefficient
const D = 0.0001;

// Population distribution
//const c = math.matrix([[300, 50, 50, 400], [300, 10, 10, 200], [50, 10, 10, 400], [100, 10, 50, 50]]);
let c = math.ones(n, n);

// c.subset(math.index(0,0), 0.1);
// c.subset(math.index(n - 1,0), 0.1);
// c.subset(math.index(0, n - 1), 0.1);

for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    c.subset(math.index(i,j), Math.random());
  }
}

// Create an N x N matrix with all zeros
let a = math.matrix();
let m = math.matrix();
let defaultValue = 0;
a.resize([N, N], defaultValue);

// Location of outbreak
const outbreakLocation = 0;

// Create initial condition
const initial = math.zeros(N, 1);

initial.subset(math.index(0, 0), 1);

// Create an N x periods matrix to hold solution to ODE system
let u = math.zeros(N, periods);


// Define a one-to-one correspondence between an index k and nodes [i, j] in the network
function fun(k) {
    let i = k % n;
    let j = (k - i)/n;

    return [i,j];
}

// Calculate distance between nodes with indices k and l
function dist(k, l) {
    let node1 = fun(k);
    let node2 = fun(l);
    return math.distance([node1[0], node1[1]], [node2[0], node2[1]]);
}

// Create matrix describing rates at which people move between nodes
function createMatrix() {
    for (let i = 0;  i < N; i++) {
        for(let j = 0; j< N; j++) {
            if(i !== j){
            // Calculate power of distance between nodes
            let d = Math.pow(dist(i,j), 2 + mu);
            let node1 = fun(i);
            // Create value for appropriate element of a
            let val = c.subset(math.index(node1[0], node1[1]))/d;
    
            // Assign value to matrix
            a.subset(math.index(i,j), val);

            // Subtract value from diagonal element
            let node2 = fun(j);
            let val1 = a.subset(math.index(i,i)) - c.subset(math.index(node2[0], node2[1]))/d;
            a.subset(math.index(i,i), val1);
            }
        }
    } 

    // Multiply matrix by diffusion coefficient
    m = math.multiply(D, a);
}

function infect(x) {
    return alpha * x * (1 - x) - beta * x;
}

function euler() {
  // Create column vector to hold model state during previous period
  let last = math.zeros(N, 1);

  for (let k = 0; k < N; k++){
      let val = initial.subset(math.index(k, 0));
      u.subset(math.index(k, 0), val);
  }

  for (let t = 0; t < periods; t++){
      for (let k = 0; k < N; k++) {
          let val = u.subset(math.index(k, t));
          last.subset(math.index(k, 0), val);

      }

      // Calculate next iteration
      let v = math.multiply(m, last);

      for (let k = 0; k < N; k++) {
          let val = u.subset(math.index(k, t)) + h * (infect(u.subset(math.index(k, t))) + v.subset(math.index(k, 0)));

          u.subset(math.index(k, t + 1), val);

      }
  }

  return u;
}

const b = math.zeros(n, n, periods);


const xLabels = new Array(n).fill(0).map((_, i) => `${i}`);
const yLabels = new Array(n).fill(0).map((_, i) => `${i}`).reverse();

const data = new Array(yLabels.length)
  .fill(0)
  .map(() =>
    new Array(xLabels.length)
      .fill(0)
  );

export default function Simulate() {


  // for(let i = 0; i < n; i++) {
  //   for(let j = 0; j < n; j++) {
  //     for (let k = 0; k < T+1; k++){
  //           b.subset(math.index(i, j, k), Math.random());
  //     }
  //   }
  // }

  createMatrix();

  // math.transpose(m);    

  let ans = euler();

  for(let t = 0; t < periods; t++){
    for(let k = 0; k < N; k++) {
      let node0 = fun(k);
      b.subset(math.index(node0[0], node0[1], t), ans.subset(math.index(k, t)))
    }
  }

  return (
      <div>
            <Spring
              from={{ number: 0 }}
              to={{ number: T - 1 }}
              config={{ duration: (T - 1)*500 }}
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
          background: `rgb(${b.subset(math.index(_x, _y, 100*Math.floor(props.number.toFixed())))*255 }, 0, ${(1 - b.subset(math.index(_x, _y, 100*Math.floor(props.number.toFixed()))))*255})`
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
          background: `rgb(${(1 - c.subset(math.index(_x, _y)))*255 }, ${(1 - c.subset(math.index(_x, _y)))*255}, ${(1 - c.subset(math.index(_x, _y)))*255 })`
        })}
        cellHeight="2rem"
        xLabelsPos="bottom"
        onClick={(x, y) => null}
        // yLabelsPos="right"
        // square
      />
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
