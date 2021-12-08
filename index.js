// Include MathJS library
const math = require('mathjs');

// Superdiffusion parameter
const mu = 0.6;

// Transmission rate
const alpha = 0.2;

// Recovery rate
const beta = 0.1;

// Number of rows in the grid
const n = 4;

// Number of nodes in the transportation network
const N = n * n;

// Step size for ODE solver
const h = 0.001;

// Number of days for the simulation
const days = 0.1;

// Number of time intervals
const periods = 200000;

// The "diffusion" coefficient
const D = 0.0001;

// Population distribution
const c = math.matrix([[300, 50, 50, 400], [300, 10, 10, 200], [50, 10, 10, 400], [100, 10, 50, 50]]);

// Create an N x N matrix with all zeros
const a = math.matrix();
let defaultValue = 0;
a.resize([N, N], defaultValue);

// Location of outbreak
const outbreakLocation = 0;

// Create initial condition
initial = math.zeros(N, 1);

initial.subset(math.index(0, 0), 1);

// Create an N x periods matrix to hold solution to ODE system
u = math.zeros(N, periods);

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
            let node1 = fun(j);
            // Create value for appropriate element of a
            let val = c.subset(math.index(node1[0], node1[1]))/d;
    
            // Assign value to matrix
            a.subset(math.index(i,j), val);

            // Subtract value from diagonal element
            let val1 = a.subset(math.index(i,i)) - val;
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


// I use Euler's method to solve the system. For better results, one could use
// Runge-Kutta. But for this simple problem, Euler's method is fine. 
function euler() {
    // Create column vector to hold model state during previous period
    last = math.zeros(N, 1);

    for (let k = 0; k < N; k++){
        val = initial.subset(math.index(k, 0));
        u.subset(math.index(k, 0), val);
    }

    for (let t = 0; t < periods; t++){
        for (let k = 0; k < N; k++) {
            val = u.subset(math.index(k, t));
            last.subset(math.index(k, 0), val);
 
        }

        // Calculate next iteration
        let v = math.multiply(m, last);

        for (let k = 0; k < N; k++) {
            val = u.subset(math.index(k, t)) + h * (infect(u.subset(math.index(k, t))) + v.subset(math.index(k, 0)));

            u.subset(math.index(k, t + 1), val);

        }
    }
}




createMatrix();

math.transpose(m);    

euler();

showResults();





