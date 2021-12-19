import React, { createContext, useContext } from 'react';

// Number of rows in the grid
const n = 30;

// Number of nodes in the transportation network
const N = n * n;

// Create population density
let c = new Array(n);
for (let i = 0; i < n; i++){
    c[i] = new Array(N).fill(0);
}

for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    c[i][j] = Math.random();
  }
}

let cur = new Array(n);
for (let i = 0; i < n; i++){
    cur[i] = new Array(N).fill(0);
}

cur[0][0] = 1;

const PandemicContext = createContext();

export const usePandemicContext = () => useContext(PandemicContext);

export const PandemicProvider = ({ children }) => {
    const dist = cur;
    const time = 0;
    const periods = 0;
    const pop = c;

    return (
      <PandemicContext.Provider value={{ dist, time, periods, pop }}>
        {/* We render children in our component so that any descendent can access the value from the provider */}
        {children}
      </PandemicContext.Provider>
    );
};