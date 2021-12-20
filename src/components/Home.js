import { useReducer, useEffect, useRef } from 'react';
import { HeatMapGrid } from 'react-grid-heatmap';
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

// Step size for ODE solver
const h = 0.01;

// The "diffusion" coefficient
const D = 0.005;

// Number of time intervals
const periods = 7;

let a = math.zeros(N, N);
let m = math.zeros(N, N);

// let c = new Array(n);
// for (let i = 0; i < n; i++){
//     c[i] = new Array(n).fill(0);
// }


// for (let i = 0; i < n; i++) {
//   for (let j = 0; j < n; j++) {
//     c[i][j] = (j !== 0 && j !== n - 1) * 0.3 * Math.random() + (0.5 + 0.5 * Math.random()) * (j === 0 || j === n - 1);
//     let rando = Math.random();
//     let rando2 = Math.random();
//     if(rando > 0.45 && rando2 > 0.45)
//     c[i][j] = 0.4 * (rando + rando2);
//   }
// }

let c = [[0.5755951483871738, 0.049671816036299, 0.13992873258806304, 0.08764762633505141, 0.5814739892431717, 0.1780979952155575, 0.29058792293984753, 0.5653063958923548, 0.2996236182681453, 0.025299908300829222, 0.2966463154175256, 0.2812246362642324, 0.08863444873703631, 0.3945360346138399, 0.14711649999329732, 0.12966644124191348, 0.231638995073393, 0.16832621579711932, 0.5414569718132451, 0.9444525515132772],
[0.6930511302809681, 0.7028044999703095, 0.4066808150821862, 0.1876285084379122, 0.06753383635939111, 0.19619869974545773, 0.2763495452685704, 0.28736991416916985, 0.6744472911226111, 0.1326435412845072, 0.01614603183941543, 0.22317963184492243, 0.1256750823577049, 0.6409222788445349, 0.5334025995115509, 0.5465484082659168, 0.11480685130681309, 0.49171040211784167, 0.09080763405974754, 0.6353578089211926],
[0.9173551880697326, 0.23356714684797247, 0.6419158869516552, 0.04386833111465405, 0.5447727193371974, 0.11151267406814515, 0.038581294756218985, 0.2676215555011712, 0.03206691268710753, 0.08159593218397172, 0.12504657869015098, 0.043088003733687395, 0.22013635813932456, 0.12809043998761308, 0.4685461890177982, 0.23434489054890906, 0.6605092355364194, 0.2605306362095185, 0.07712472468929743, 0.9329009845156788],
[0.6447318252370816, 0.004988395871593476, 0.5755880814030823, 0.10533458809527482, 0.043017552800399025, 0.2865950396564422, 0.5325560360556619, 0.25910695081663143, 0.18172849935201948, 0.1810800783811089, 0.0622914690493783, 0.24968967209867357, 0.2164169178357556, 0.12328698660049342, 0.261655793233325, 0.5579796946182699, 0.007169987956742885, 0.5211109567960345, 0.4111123074040716, 0.7881703038359599],
[0.5007562747182794, 0.18099049830813022, 0.22025714434353721, 0.15075409610533982, 0.10232944669576269, 0.1946508143741154, 0.1980280427473419, 0.5085418472977395, 0.27348528557866963, 0.02009366433405324, 0.09780334630718869, 0.19040473558644172, 0.1388961818567614, 0.0325572971870056, 0.18572964535566042, 0.14244863223372073, 0.5552356462525725, 0.6613947066664703, 0.24581657301820042, 0.8260297486363142],
[0.7785791061945708, 0.0924234884925728, 0.07521226368936147, 0.17112055798805684, 0.14534418500738103, 0.0787965797660513, 0.08530392024757709, 0.44528905678471137, 0.5626496385877773, 0.05375313080395876, 0.2191037014009253, 0.004768020480657297, 0.11994733808917035, 0.12007882546560075, 0.6804611257234937, 0.5852834455112874, 0.5083510600497632, 0.6895728690780135, 0.29882046657177636, 0.5112170069259548],
[0.5669431609424768, 0.24334744884105886, 0.08836823086987533, 0.029602898272326605, 0.6278653714773683, 0.21866511785866435, 0.0674646667300648, 0.14414620417529003, 0.03542367381983218, 0.5386046821725919, 0.09520419866594505, 0.6050617776873076, 0.02762118764305728, 0.005093327038947514, 0.5830594576072878, 0.24324527183856925, 0.1731148184922501, 0.6442118177161569, 0.2213181362350142, 0.5980477383668551],
[0.7940522970599749, 0.11906414211600026, 0.24007465054367175, 0.12835544012984512, 0.36989677675421045, 0.4192110580182411, 0.11538164157465569, 0.46490520045015415, 0.47843838449180015, 0.5650313569971817, 0.2748743717885252, 0.01676938928516698, 0.07149253468314895, 0.4341114849989647, 0.10124240216150661, 0.2844782052815473, 0.5909757205618791, 0.19213234572146556, 0.5960198743223569, 0.5249377896988779],
[0.5243208906936513, 0.6018483000365772, 0.6973940276327423, 0.5596411883386021, 0.09792020508142814, 0.2293538710010975, 0.07251871194571464, 0.023051520959537972, 0.2608891225761886, 0.23587108126779902, 0.029326584029346292, 0.7628229980319039, 0.06140410209622253, 0.14574206750894558, 0.6389039941857124, 0.6854741627078491, 0.07335437756018819, 0.2306505167497198, 0.013857361041192196, 0.5176922106302477],
[0.9899701794755245, 0.004361913053200972, 0.6518619722738116, 0.6906705952118504, 0.4210036283939628, 0.02007472573357414, 0.12360416417460118, 0.023035375998951002, 0.01433260751260046, 0.4848815629024874, 0.18996057505728325, 0.6470257903798543, 0.20466215730599027, 0.5615068479456514, 0.23463568621775438, 0.15853396295340283, 0.7065268017782175, 0.12740397478112012, 0.08252148627416844, 0.6798597013097699],
[0.5517039879941629, 0.44179839603324433, 0.2933509445877195, 0.6042684194781147, 0.2028760615239121, 0.09109990864859838, 0.168204450566013, 0.29625944775565727, 0.022698312567321376, 0.2913039793008594, 0.05687408383188072, 0.019004318257542584, 0.053622137866919585, 0.6046514915125925, 0.03693521360217351, 0.6823407162868894, 0.2491801343938278, 0.21134974151777622, 0.6837123249583095, 0.7334252138775021],
[0.5078005511180844, 0.16082036874785285, 0.0765058501565299, 0.46543114061750857, 0.03489282467851684, 0.5198716029163198, 0.17276184063278288, 0.27950145775999374, 0.10880237574205949, 0.2151996827685439, 0.20395057434927413, 0.0845290484631056, 0.02731082076975102, 0.44455445286237005, 0.1279727140411491, 0.07550714937283202, 0.6659348975957182, 0.18330125514982867, 0.1739894343355345, 0.9922695341521824],
[0.5555708062118061, 0.08406486278155283, 0.0121130715242198, 0.5934009680530805, 0.03000066467748681, 0.0486618271964897, 0.05146464486839617, 0.0905209351152387, 0.5575230849880197, 0.04773007736694752, 0.23774294441595079, 0.18649441563984906, 0.232530730849754, 0.006297539709403921, 0.2815771692309447, 0.29008949127038297, 0.004372703108489228, 0.11193789176784594, 0.26398338538111427, 0.5404946825128695],
[0.8791811913853954, 0.5485160534623995, 0.2539931958885614, 0.2893846717616578, 0.053015818612795605, 0.048793029338665604, 0.0836362396723105, 0.16341075428108578, 0.052552473808185, 0.49652901742610234, 0.07597215792794405, 0.5130065974032995, 0.20234609561590852, 0.15850923235676115, 0.24733626717306145, 0.011762868995449649, 0.22182048479743136, 0.06527000193264944, 0.1555193949905536, 0.6544604203502459],
[0.5503703078745574, 0.2839389925504668, 0.0786956415365412, 0.18316942110082116, 0.0779283787297201, 0.10617953860454606, 0.16862435432743864, 0.16082479029893593, 0.19022592711492117, 0.21874871412018126, 0.4483399462925812, 0.2515868087650597, 0.6262247635151705, 0.26317854723726836, 0.046899094885024195, 0.11781133720637771, 0.18926449667837966, 0.08804445904854703, 0.5355716990913221, 0.7396641358428181],
[0.7686658074994364, 0.027000625877078122, 0.1101214510817235, 0.09688838683287657, 0.01176108920391432, 0.1255916685678358, 0.0896695258833243, 0.11996092753470042, 0.5634750834716747, 0.14140735105032168, 0.0794400431202364, 0.008995010483524423, 0.09568588859576112, 0.020662577818601233, 0.12208872898220285, 0.13604427033483454, 0.41167140594015267, 0.2090143298971172, 0.19639853053867465, 0.9414559476086743],
[0.5300207410242516, 0.6294428971786318, 0.05372108450406676, 0.2398694419752953, 0.030253179972733135, 0.22823460157396536, 0.018988157940850958, 0.16508411117000044, 0.20462563851835294, 0.018056584596161062, 0.5341264305124264, 0.012213945537277615, 0.734494872869723, 0.2582135788676226, 0.05391670682051901, 0.09997757572153607, 0.2291185550328448, 0.6431932109682057, 0.19974548892996238, 0.8459973583467509],
[0.8031069362846639, 0.04967015357197633, 0.047793272350209935, 0.19787268691533313, 0.21664430889874545, 0.6093977773902889, 0.19627278631492187, 0.023289717030675925, 0.11477865079956184, 0.5145924988939794, 0.005646131085372774, 0.05234256016095233, 0.09818672122765681, 0.49920942120135914, 0.48473335349068813, 0.37889154446672874, 0.48341214756770595, 0.5490905988187104, 0.23885212828255287, 0.7756770008587125],
[0.8489873080326793, 0.189796593920934, 0.03268685364241173, 0.06535372126777805, 0.2987225928652199, 0.0965633617148609, 0.2509607227719607, 0.02863576624106927, 0.0034511689768313533, 0.5241424381082819, 0.42174519054634696, 0.1298906764291743, 0.0373411959008535, 0.05528399249876657, 0.22800801118139238, 0.6967350781546318, 0.1957866879758246, 0.668062122798861, 0.2803166176284209, 0.6999502124926856],
[0.7482569947741431, 0.2529971769886013, 0.6977383102630518, 0.066877843087, 0.2390909424802069, 0.29519097947553874, 0.09364111713125345, 0.027786537315214965, 0.23931673173604906, 0.051073927684144094, 0.17440332676586248, 0.2652028115730563, 0.2774735584392421, 0.11914520636338974, 0.036409115397076676, 0.12757036496649277, 0.10073080788660305, 0.10592639975611663, 0.4380443948800962, 0.7881570920854284]];

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
  percentSick: 100*c[0][0]/totalPop,
  alpha: 2,
  beta: 0.4
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
    idRef.current = setInterval(() => dispatch({ type: "iterate" }), 250);
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
        <p className="title is-4 is-size-7-mobile">
                            What is this and how does it work?
                        </p>
                        <p>
                            When the user clicks the "Run" button, this app displays an animation describing an epidemic spreading over a geographic space. The user can also change infection parameters below. This makes it possible to visualize the way different factors affect the spread of diseases like COVID-19. It is based on a mathematical model which is described in more detail below. The "Infection Distribution" chart shows the percentage of people in each location who are sick at a given point in time (the redder the square, the more sick people). The other grid shows how population density varies across space (darker squares can be thought of like cities, while lighter squares represent more sparsely populated areas). Since there is more traffic through high-population areas, infections tend to spread to those places relatively quickly. Click the "Run" button to start the simulation, which displays in real time below. 
                            <br>
                            </br>
                            <br>
                            </br>
                        </p>
                        <p className="title is-4 is-size-7-mobile">
                            {state.message}
                            <br>
                            </br>
                            <br>
                            </br>
                        </p>
                        
                        <p className="subtitle is-6 is-size-7-mobile">
                          Number of days after initial outbreak: {state.time}
                        </p>
                        <div className="columns">
        <div className="column">
                        
                   <div className="box">   
                   <p className="title is-6 has-text-centered is-size-7-mobile">
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



<p className="subtitle is-6 has-text-centered is-size-7-mobile">
                     Red = 100% infection rate, Blue = 0% infection rate
                  </p>
            </div>  
            
          </div>

        <div className="column">
        
            
                        
                   <div className="box">   
                   <p className="title is-6 has-text-centered is-size-7-mobile">
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

<p className="subtitle is-6 has-text-centered is-size-7-mobile">
                     Light = low population density, Dark = high population density
                  </p>
      </div>
      
      </div>
      </div>
      <p className="title is-4 is-size-7-mobile">
                            Effective transmission rate
                            <br>
                            </br>
                            <br>
                            </br>
                        </p>
                        
                        <p className="subtitle is-6 is-size-7-mobile">
                          Current value: {state.alpha.toFixed(1)} 
                          <br>
                            </br>
                        
                          
                          <a className="button is-black is-small"
  style={styles.space}
  onClick={() => dispatch({ type: "increase" })}
    >
      <span>+</span>
    </a>
    <a className="button is-black is-small"
  style={styles.space}
  onClick={() => dispatch({ type: "decrease" })}
    >
      <span>-</span>
    </a>
                        </p>
                        <p>
                          The effective transmission rate measures how many people a typical infected person will infect in a given period of time. The effective transmission rate depends on the type of disease, but it can also be changed by human intervention. For example, if people stay home when they get sick, then this may decrease the number of other people they infect. The buttons above can be used to increase or decrease the effective transmission rate in this model. 
                          <br>
                            </br>
                            <br>
                            </br>
                        </p>
                        <p className="title is-4 is-size-7-mobile">
                            Recovery rate
                            <br>
                            </br>
                            <br>
                            </br>
                        </p>
                        
                        <p className="subtitle is-6 is-size-7-mobile">
                          Current value: {state.beta.toFixed(1)} 
                          <br>
                            </br>
                        
                          
                          <a className="button is-black is-small"
  style={styles.space}
  onClick={() => dispatch({ type: "increasebeta" })}
    >
      <span>+</span>
    </a>
    <a className="button is-black is-small"
  style={styles.space}
  onClick={() => dispatch({ type: "decreasebeta" })}
    >
      <span>-</span>
    </a>
                        </p>
                        <p>
                          The recovery rate measures how quickly people recuperate from the disease. The recovery rate might change, for example, if people get access to better medical care. Click the buttons above to increase or decrease the recovery rate for this model. 
                          <br>
                            </br>
                            <br>
                            </br>
                        </p>
      <p className="title is-4 is-size-7-mobile">
                            More about this Model
                        </p>
                        <p>
                
                        </p>
                        <p>
                            How does a disease like COVID-19 spread? To answer this question, we need to understand how people move from place to place. In the past, mathematical epidemiologists have tried to understand human mobility by using the diffusion model from physics. The diffusion model essentially describes a person or object which moves by taking steps that are small, independent and random. However, it has been known for a long time that this model does not give a realistic way to describe the spread of epidemics, because the way people move is more complicated. 
                            <br>
                            </br>
                            <br>
                            </br>
                            To develop a better model of human mobility, Dirk Brockmann (then at Northwestern University) and colleagues <a href="http://rocs.northwestern.edu/research/wgstory.html">analyzed data from a variety of sources</a>. This website is based on <a href="https://ul.qucosa.de/api/qucosa%3A13918/attachment/ATT-0/">an early mathematical model they created</a> to capture the relationships they uncovered in the data. Their model incorporates the idea that human mobility includes both short trips (i.e., a few miles or less) along with occasional long-distance trips (such as plane trips between continents). The model also assumes that locations with higher population density tend to be visited more often than low-population areas. Their analysis of different data sources allowed them to quantify these ideas precisely. Since their model was first created, <a href="https://www.aimsciences.org/article/doi/10.3934/eect.2013.2.173">its mathematical properties have been further analyzed</a> and <a href="https://rocs.hu-berlin.de">more sophisticated models</a> have been created as well. 
                            <br>
                            </br>
                            <br>
                            </br>
                            An important consequence of the model is that diseases tend to spread to high-population areas more quickly than low-population areas. This app offers a simple way to visualize this process. The user can also see how the results change when the effective transmission rate and recovery rate are altered (if the former becomes smaller than the latter, the disease will die out and the epidemic will be stopped!). As epidemiological models grow more sophisticated, one can hope that this will help to control the spread of future disease outbreaks, offering precise forecasts that can guide policy and save lives. 
                            <br>
                            </br>
                            <br>
                            </br>
                            {/* This model admittedly gives a <i>highly</i> schematized representation of how a pandemic would spread across the surface of the earth. But a truly realistic model would require a supercomputer to solve, as well as significant time spent on data gathering and programming. Nonetheless, this app helps illustrate the logic behind more sophisticated models, by providing a simple visual representation of spatial infection dynamics. 
                            <br>
                            </br>
                            <br>
                            </br> */}
                        </p>

                        <p className="title is-4 is-size-7-mobile">
                            How This App Was Created
                        </p>
                        <p>

                        </p>
                        <p>
                            This is a single-page application created with ReactJS. I made the grids with react-heatmap-grid, and used mathJS to write the equation solver, which applies Euler's method to a system of 400 nonlinear differential equations. The app also uses React hooks to update the page in real time while the equations are being solved. 
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

function infect(x, state) {
  return state.alpha * x * (1 - x) - state.beta * x;
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
          let val = u.subset(math.index(k, t)) + h * (infect(u.subset(math.index(k, t)), state) + v.subset(math.index(k, 0)));

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
    case "increase":
      return {...state, alpha: (state.alpha < 4) * (state.alpha + 0.1) + (state.alpha >= 4) * 4 };
    case "decrease":
      return {...state, alpha: (state.alpha > 0.1) * (state.alpha - 0.1) };
    case "increasebeta":
      return {...state, beta: (state.beta < 4) * (state.beta + 0.1) + (state.beta >= 4) * 4 };
    case "decreasebeta":
      return {...state, beta: (state.beta > 0.1) * (state.beta - 0.1) };
    default:
      throw new Error();
  }
}

createMatrix();