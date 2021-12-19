import React from "react";
import { Spring } from "react-spring";
import { HeatMapGrid } from "react-grid-heatmap";


const math = require('mathjs');

// Number of rows in the grid
const n = 6;

// Number of nodes in the transportation network
const N = n * n;

const b = math.zeros(n, n, n);

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


const xLabels = new Array(n).fill(0).map((_, i) => `${i}`);
const yLabels = new Array(n).fill(0).map((_, i) => `${i}`).reverse();

const data = new Array(yLabels.length)
  .fill(0)
  .map(() =>
    new Array(xLabels.length)
      .fill(0)
  );

export default function Home() {


  // for(let i = 0; i < n; i++) {
  //   for(let j = 0; j < n; j++) {
  //     for (let k = 0; k < T+1; k++){
  //           b.subset(math.index(i, j, k), Math.random());
  //     }
  //   }
  // }



  // math.transpose(m);    

  b.subset(math.index(0, 0, 0), 1);

  return (
      <div className='box'>
        <p className="title is-4">
                            What is this and how does it work?
                        </p>
                        <p>
                            This app, which is still in development, shows how the distribution of population across space can affect the way a disease spreads. The red and blue grid below shows the number of infected people in different locations (redder rectangles represent higher percentages of infected people, bluer rectangles represent lower percentages). The other grid shows how population density varies across space (darker shades of gray represent higher populations). Click the "Run" button to start the simulation. See below for more information about the model. 
                            <br>
                            </br>
                            <br>
                            </br>
                        </p>
                        <p className="title is-4">
                            Current State (Click "Run" To Start Simulation)
                        </p>
                        <div className="columns">
        <div className="column">
                        
                   <div className="box">   

            
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
          background: `rgb(${b.subset(math.index(_x, _y, 0))*255 }, 0, ${(1 - b.subset(math.index(_x, _y, 0)))*255})`
        })}
        cellHeight="2rem"
        xLabelsPos="bottom"
        onClick={(x, y) => null}
        // yLabelsPos="right"
        // square
      />




            </div>  
          </div>

        <div className="column">
            
                        
                   <div className="box">   
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
      </div>
      </div>
      <p className="title is-4">
                            About the Model
                        </p>
                        <p>

                        </p>
                        <p>
                            How does a disease like COVID-19 spread? To answer this question, we first need to understand how people move from place to place. 
                            <br>
                            </br>
                            <br>
                            </br>
                            In the past, mathematical epidemiologists have tried to understand human mobility by using the diffusion model from physics. The diffusion model essentially describes a particle that moves by taking large numbers of small, and independent, random steps. However, it has been known for a long time that this model does not give a realistic way to describe the spread of epidemics, because the way people move is more complicated. 
                            <br>
                            </br>
                            <br>
                            </br>
                            To develop a better model of human mobility, Dirk Brockmann (then at Northwestern University) and colleagues <a href="http://rocs.northwestern.edu/research/wgstory.html">analyzed data from a variety of sources,</a> including the circulation of dollar bills across the US. This website is based on an early mathematical model they created which captures these insights. Their incorporates the idea that human mobility includes both short trips (i.e., a few miles or less) along with occasional long-distance trips (such as plane trips between continents). It also assumes that locations with higher population density tend to be visited more often than low-population areas. Their analysis of money circulation and other data sources allowed them to quantify these ideas precisely and create the <a href="https://ul.qucosa.de/api/qucosa%3A13918/attachment/ATT-0/">system of differential equations upon which this website is based</a>. Since the model was first created, <a href="https://www.aimsciences.org/article/doi/10.3934/eect.2013.2.173">its mathematical properties have been further analyzed</a> and <a href="https://rocs.hu-berlin.de">more sophisticated models</a> have been created as well. 
                            <br>
                            </br>
                            <br>
                            </br>
                            An important consequence of the model, which can be seen in the simulation above, is that diseases tend to spread to high population areas relatively soon after an initial outbreak, while low-popuation areas may see the disease spread more slowly, even if they are close to the initial outbreak. This website offers a simple way to visualize this process. As epidemiological models grow more sophisticated, one can hope that this will help to control the spread of future disease outbreaks and offer precise forecasts that can help to guide policy. 
                            <br>
                            </br>
                            <br>
                            </br>
                            This model admittedly gives a <i>highly</i> schematized representation of how a pandemic would spread across the surface of the earth. But a truly realistic model would require a supercomputer to solve, as well as significant time spent on data gathering and programming. Nonetheless, this app helps illustrate the logic behind more sophisticated models, by providing a simple visual representation of spatial infection dynamics. 
                            <br>
                            </br>
                            <br>
                            </br>
                        </p>

                        <p className="title is-4">
                            How This App Was Created
                        </p>
                        <p>

                        </p>
                        <p>
                            This is a single-page application created with ReactJS. I made the animation with the react-spring package, created the grids with react-heatmap-grid, and used mathJS to write the equation solver. (The solver is very simple; it relies on Euler's method to solve the system of nonlinear ordinary differential equations.) 
                            <br>
                            </br>
                            <br>
                            </br>
                        </p>
          </div>
  );
}

