import { useReducer, useEffect, useRef } from 'react';
import { HeatMapGrid } from "react-grid-heatmap";
import { Slider } from '@material-ui/core';
import Header from './Header';
import Footer from './Footer';

const math = require('mathjs');

const styles = {
  hov: {
    cursor: 'pointer',
  },
  right: {
    float: "right",
  },
  space: {
    margin:"5px",
  },
}

// Number of rows in the grid
const n = 20;

// Number of nodes in the transportation network
const N = n * n;

// Superdiffusion parameter
const mu = 0.6;

// Transmission rate
const alpha = 0.5;

// Recovery rate
const beta = 0.1;

// Step size for ODE solver
const h = 0.01;

// The "diffusion" coefficient
const D = 0.005;

// Number of time intervals
const periods = 20;

let a = math.zeros(N, N);
let m = math.zeros(N, N);

let c = new Array(n);
for (let i = 0; i < n; i++){
    c[i] = new Array(N).fill(0);
}

for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    c[i][j] = (j !== 0 && j !== n - 1) * 0.3 * Math.random() + (0.5 + 0.5 * Math.random()) * (j === 0 || j === n - 1);
    let rando = Math.random();
    let rando2 = Math.random();
    if(rando > 0.45 && rando2 > 0.45)
    c[i][j] = 0.4 * (rando + rando2);
  }
}

let totalPop = 0;

for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    totalPop += c[i][j];
  }
}

let initial = new Array(n);
for (let i = 0; i < n; i++){
    initial[i] = new Array(N).fill(0);
}

let cur = new Array(n);
for (let i = 0; i < n; i++){
    cur[i] = new Array(N).fill(0);
}

initial[0][0] = 1;

// Create an N x periods matrix to hold solution to ODE system
let u = math.zeros(N, periods);

// Population distribution
//const c = math.matrix([[300, 50, 50, 400], [300, 10, 10, 200], [50, 10, 10, 400], [100, 10, 50, 50]]);
//let c = math.ones(n, n);

// c.subset(math.index(0,0), 0.1);
// c.subset(math.index(n - 1,0), 0.1);
// c.subset(math.index(0, n - 1), 0.1);

// for (let i = 0; i < n; i++) {
//   for (let j = 0; j < n; j++) {
//     let val = Math.random();
//     c.subset(math.index(i,j), val);
    
//   }
// }

// const c = math.matrix([[0.44403420768804525, 0.5468756637401027, 0.01023590527368845, 0.7343943354787394, 0.9578643197479721, 0.7375253392266197, 0.8418495200962366, 0.886871043717806, 0.9382941446940112, 0.5652031318984301, 0.5548633255795692, 0.5623657187927513, 0.7464465791920911, 0.22606850101070153, 0.5918037971869703, 0.19544024595208498, 0.9917003328017371, 0.09077547156839172, 0.17404350932967727, 0.9207863584372851],
//   [0.03626940329225237, 0.5083184693086018, 0.5456608537823568, 0.06608916515411134, 0.8869600856356457, 0.8564391326418199, 0.10959281224872619, 0.7444559157470683, 0.34068121898399206, 0.2574771234216815, 0.42292612539323726, 0.9430467918381482, 0.5505997025669966, 0.20622244911892462, 0.4949857921053191, 0.8197646865767256, 0.7661034369165798, 0.45063738833358946, 0.24934441251196438, 0.32201112755596495],
//   [0.6091544582957769, 0.14699374709719049, 0.9013694937176782, 0.4601910964960576, 0.14103182735166198, 0.9485641284855832, 0.8215290328960341, 0.6738074481910854, 0.9857832800724617, 0.0675849027174471, 0.0692285283766334, 0.3595253662134732, 0.3893159842614282, 0.37629036603791777, 0.2249894414095439, 0.8253391434067878, 0.7342741867334197, 0.13220671257375693, 0.16375752715502956, 0.8750976213235488],
//   [0.7930045141408362, 0.06566706103994635, 0.8406764329323091, 0.10288689922836691, 0.6960143443680089, 0.5368803893427345, 0.1981248901671302, 0.3652728676287782, 0.10813694660509099, 0.35816790052307135, 0.2555669552872273, 0.28752736154885294, 0.041621924523573606, 0.3408403492024452, 0.5348163643202168, 0.8423346318517728, 0.49812735654983276, 0.2916682821467702, 0.17260016175009119, 0.8534103319914959],
//   [0.9454710503860067, 0.5654688741523728, 0.46019173740913333, 0.574608500152473, 0.6280197231449094, 0.3595403953634351, 0.8493728813478925, 0.9626111328102167, 0.7979850635556918, 0.9546913869047244, 0.8659878846363378, 0.9755915980078671, 0.4007076589835117, 0.6843927131859275, 0.6915478076147721, 0.42418521021763844, 0.2351204015696382, 0.041354579009988734, 0.9544189884076788, 0.6119097929415223],
//   [0.3784523047809716, 0.504187523078699, 0.7753709738879626, 0.7658733741786548, 0.5096167922471244, 0.18073909363500995, 0.9440050560966957, 0.330621068972055, 0.019324854940226066, 0.03467146712136171, 0.19993093574323595, 0.35135273739578476, 0.9613115325416499, 0.6756148352861557, 0.7727143313917206, 0.8670446522648159, 0.7155497889188009, 0.6615659908942528, 0.39933913586946246, 0.5971074512837791],
//   [0.09877060711442276, 0.9180942078191341, 0.6312494668397237, 0.3892075015220886, 0.3982537574067828, 0.14310552317053582, 0.5157260621633251, 0.1826098626986168, 0.41093155906765055, 0.579807022534303, 0.18854079260335643, 0.6177634271150674, 0.6719555865940163, 0.20734989978527985, 0.7527008474005912, 0.5802767729194087, 0.16208499542387278, 0.7647642484892727, 0.15692612649180337, 0.9345839045332165],
//   [0.5552457912278794, 0.30840327571745485, 0.045497392978668394, 0.19668179334199132, 0.15803397518355422, 0.4557515897349236, 0.5512774968381333, 0.018077372188460394, 0.045132220747743146, 0.5916944259446406, 0.7197028569839583, 0.8477528049870606, 0.6828820481483331, 0.7362862581693586, 0.8566989647161796, 0.26994751771871006, 0.35148228189818553, 0.5581378424611267, 0.43239113393410245, 0.23385534973694044],
//   [0.9124718592414993, 0.44919307562674193, 0.5781830621018822, 0.01180361489312376, 0.7345713577430217, 0.4173459810520057, 0.9909730159778494, 0.7269257518651255, 0.05931380788517071, 0.7450580650557033, 0.07423623025975079, 0.5251043046890789, 0.2859740091257963, 0.29095846654045476, 0.6994680987436395, 0.4127512652312064, 0.34866064972442246, 0.4478446553951638, 0.9303322759487136, 0.7522156667524327],
//   [0.6021642333872506, 0.07318810002836229, 0.6005965552102279, 0.7238493199451119, 0.6488953263334674, 0.3377364022414502, 0.17886398622358968, 0.9495869319216574, 0.22519444276280032, 0.2780625287287575, 0.2893661505560623, 0.9655059548524465, 0.10267956901572317, 0.16724333525476354, 0.12695003342847588, 0.05948627255158789, 0.3568782154943291, 0.796959471138535, 0.5404665605266847, 0.3267738921546919],
//   [0.8595017222457026, 0.9599235626282137, 0.00701536633656219, 0.8381852074043852, 0.1256983240403171, 0.37631888264259183, 0.7696154739206371, 0.2614321595730149, 0.05286556965512679, 0.5426048960319951, 0.6914022227852099, 0.15506257007229585, 0.16672965785814498, 0.9316321478173819, 0.12793432365575885, 0.015003419204907331, 0.2095687495044838, 0.39071980978612064, 0.8989137074666413, 0.44774941070160246],
//   [0.9570758921014193, 0.22413334203490987, 0.7216936892994945, 0.08933038613437994, 0.3675737306614988, 0.009950791622160837, 0.7203552597137626, 0.8136983414511065, 0.02475958244971732, 0.0005987688191073648, 0.32961265093926007, 0.8017630097569823, 0.722693935100533, 0.3210739076384015, 0.3365837024060949, 0.19505288729352266, 0.9879573114127693, 0.23515974786859317, 0.35898072796386415, 0.6693141220846193],
//   [0.9291565555091585, 0.02373877195079177, 0.32383843938063817, 0.15485649710202742, 0.07985071893675388, 0.473648702064845, 0.8648001776667775, 0.9836978167028108, 0.7856861276427436, 0.9898348821242258, 0.9669732767160741, 0.13824345616324507, 0.637345608209424, 0.5800836183096052, 0.44756964092584695, 0.7028241557992139, 0.06526313060533839, 0.715249786276335, 0.7118008218663925, 0.5696092326904929],
//   [0.49930242832333516, 0.16145298226761184, 0.6093836773762424, 0.25750183535197, 0.835347417833024, 0.38622247750348193, 0.5164954900964887, 0.394736232198581, 0.3259290094793421, 0.30824464214037817, 0.6093376308645606, 0.49231215338808454, 0.86235645097384, 0.40105518902524273, 0.48139688434531047, 0.992245303271553, 0.9721245159789624, 0.4102471395655747, 0.6757539795483798, 0.954499148592149],
//   [0.10932603634295601, 0.644845401260949, 0.03152426657102669, 0.29266040788854153, 0.656918209652233, 0.344336954363871, 0.6453446546666688, 0.790725495432945, 0.40655112606004673, 0.36907136254811745, 0.35513811395962613, 0.2912457353053801, 0.231704851241902, 0.8579250175950468, 0.8863579044588141, 0.881122690090695, 0.7167635802266783, 0.32848858972181105, 0.07265245260200826, 0.3848332334505422],
//   [0.0673256372707518, 0.36646678224646956, 0.7211700624070194, 0.2860047428288537, 0.10546277991467168, 0.14344912368913398, 0.1784082743883615, 0.3001925078211851, 0.03146689081636689, 0.13257043303631355, 0.6128714927965966, 0.43481490866792183, 0.3788396806029948, 0.1450444658003185, 0.7839819851381586, 0.8638187873619203, 0.25422577025309434, 0.9646647473632588, 0.5908622893661, 0.9163833312607996],
//   [0.45036733828898146, 0.7003255088850129, 0.8067948885904064, 0.2597869929228187, 0.29612657789732544, 0.6092088905762436, 0.7448121824263885, 0.8010766395788569, 0.8924504033216307, 0.24528981358115476, 0.11094841680370737, 0.23331047272654892, 0.7197038679800114, 0.1375622305562958, 0.13683828341592985, 0.908352244982495, 0.060074897918446, 0.36933692982071054, 0.7778572546308395, 0.2578977177193098],
//   [0.7508986318108879, 0.321130730231173, 0.7627098938970007, 0.5741304175736952, 0.11166242378933156, 0.7531485923714256, 0.9832124895911982, 0.4558028826280587, 0.21763699349957277, 0.10567740727490005, 0.7322930804461627, 0.8197120957244508, 0.5580719581099727, 0.5786034814557233, 0.2508159107381094, 0.2956783322658374, 0.5250503485683371, 0.05619892651756264, 0.26441452453276093, 0.5798562586477753],
//   [0.41152617269917324, 0.25446912462245463, 0.6542927692690568, 0.6665478111131902, 0.7364054552022887, 0.489565780131358, 0.8780337726194389, 0.7152695853898918, 0.18106168207145235, 0.31580624431267945, 0.28558137621667146, 0.27291886327566095, 0.06885231910125778, 0.29140330799974734, 0.20992069622360043, 0.0646461768350095, 0.6727352780463429, 0.8972834763131277, 0.6332975530891825, 0.3544463054700673]
// ]);


const xLabels = new Array(n).fill(0).map((_, i) => `${i+1}`);
const yLabels = new Array(n).fill(0).map((_, i) => `${i+1}`).reverse();

const data = new Array(yLabels.length)
  .fill(0)
  .map(() =>
    new Array(xLabels.length)
      .fill(0)
  );

const initialState = {
  isRunning: false,
  infections: initial,
  time: 0,
  periods: 0,
  population: c,
  message: 'Current state (click the "Run" button above to start the simulation)',
  percentSick: 100*c[0][0]/totalPop
}

export default function Home() {


  const [state, dispatch] = useReducer(reducer, initialState);
  const idRef = useRef(0);


  const infectionDist = (_x, _y) => {
    return state.infections[_x][_y];
  } 

  const populationDist = (_x, _y) => {
    return state.population[_x][_y];
  }

  const showPercent = () => state.percentSick;

  const runner = () => state.time;

  useEffect(() => {
    if (!state.isRunning) {
      return;
    }
    idRef.current = setInterval(() => dispatch({ type: "iterate" }), 500);
    return () => {
      clearInterval(idRef.current);
      idRef.current = 0;
    };
  }, [state.isRunning]);

  // for(let i = 0; i < n; i++) {
  //   for(let j = 0; j < n; j++) {
  //     for (let k = 0; k < T+1; k++){
  //           b.subset(math.index(i, j, k), Math.random());
  //     }
  //   }
  // }



  // math.transpose(m);    

  // b.subset(math.index(0, 0, 0), 1);

  return (
    <div className="notification is-black">
      <Header />
      <header className="navbar" style={styles.right}>

<a className="button is-black"
  style={styles.space}
  onClick={() => dispatch({ type: "run" })}
    >
      <span>Run</span>
    </a>
    <a className="button is-black"
    style={styles.space}
    onClick={() => dispatch({ type: "stop" })}
    >
      <span>Stop</span>
    </a>
    <a className="button is-black"
    style={styles.space}
    onClick={() => dispatch({ type: "reset" })}
    >
      <span>Reset</span>
    </a>

</header>
      <div className='box'>
        <p className="title is-4">
                            What is this and how does it work?
                        </p>
                        <p>
                            This app provides a way to visualize how different factors, like the distribution of population across space, and the disease transmission rate, can affect the way an epidemic spreads. The "Infection Distribution" chart below shows the percentage of people in each location who are sick (the redder the square, the more sick people). The other grid shows how population density varies across space (darker squares represent more highly populated areas). Since there is more traffic through high-population areas, infections tend to spread to those places relatively quickly. Click the "Run" button to start the simulation. See below for more information about the model. 
                            <br>
                            </br>
                            <br>
                            </br>
                        </p>
                        <p className="title is-4">
                            {state.message}
                            <br>
                            </br>
                            <br>
                            </br>
                        </p>
                        
                        <p className="subtitle is-6">
                          Number of days after initial outbreak: {state.time}
                        </p>
                        <div className="columns">
        <div className="column">
                        
                   <div className="box">   
                   <p className="title is-6 has-text-centered">
                     Infection Distribution
                  </p>

            
      <HeatMapGrid
        data={data}
        xLabels={xLabels}
        yLabels={yLabels}
        squares
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
          background: `rgb(${infectionDist(_x, _y)*255 }, 0, ${(1 - infectionDist(_x, _y))*255})`
        })}
        cellHeight="1rem"
        xLabelsPos="bottom"
        onClick={(x, y) => null}
        // yLabelsPos="right"
        // square
      />



<p className="subtitle is-6 has-text-centered">
                     Red = 100% infection rate, Blue = 0% infection rate
                  </p>
            </div>  
            
          </div>

        <div className="column">
        
            
                        
                   <div className="box">   
                   <p className="title is-6 has-text-centered">
                     Population Distribution
                  </p>
    
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
          background: `rgb(${(1 - populationDist(_x, _y))*255 }, ${(1 - populationDist(_x, _y))*255}, ${(1 - populationDist(_x, _y))*255 })`
        })}
        cellHeight="1rem"
        xLabelsPos="bottom"
        onClick={(x, y) => null}
        // yLabelsPos="right"
        // square
      />

<p className="subtitle is-6 has-text-centered">
                     Light = low population density, Dark = high population density
                  </p>
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
          <Footer />
          </div>
  );
}

// Define a one-to-one correspondence between an index k and nodes [i, j] in the network
function fun(k) {
  let i = k % n;
  let j = (k - i)/n;

  return [i,j];
}

// Inverse of one-to-one correspondence defined above
function funInverse(i, j) {
  return i + j * n;
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
          let val = c[node1[0]][node1[1]]/d;
  
          // Assign value to matrix
          a.subset(math.index(i,j), val);

          // Subtract value from diagonal element
          let node2 = fun(j);
          let val1 = a.subset(math.index(i,i)) - c[node2[0]][node2[1]]/d;
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

function euler(state) {
  // Create column vector to hold model state during previous period
  let last = math.zeros(N, 1);

  for (let k = 0; k < N; k++){
    let node0 = fun(k);
    u.subset(math.index(k, 0), state.infections[node0[0]][node0[1]]);
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

  for (let k = 0; k < N; k++){
    let node0 = fun(k);
    cur[node0[0]][node0[1]] = u.subset(math.index(k, periods - 1));
    
  }



  return cur;
}

function calculatePercent(state) {
  let sick = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      sick += state.infections[i][j] * state.population[i][j];
    }
  }
  return 100*sick/totalPop;
}

function reducer(state, action) {
  switch (action.type) {
    case "run":
      return { ...state, isRunning: true, message: 'Current state (simulation now running)', percentSick: calculatePercent(state)};
    case "stop":
      return { ...state, isRunning: false, message: 'Current state (click the "Run" button above to start the simulation)', percentSick: calculatePercent(state)};
    case "reset":
      return { ...state, isRunning: false, time: 0, infections: initial, message: 'Current state (click the "Run" button above to start the simulation)', percentSick: 100*c[0][0]/totalPop};
    case "iterate":
      return { ...state, time: state.time + 1, infections: euler(state), percentSick: calculatePercent(state)};
    default:
      throw new Error();
  }
}

createMatrix();