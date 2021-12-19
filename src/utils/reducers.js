import {
    RUN,
    STOP,
} from './actions';

function iterate (arr) {
    let k = 0;
    for (let i = 0; i < 1000; i++){
        arr[0][0] = Math.random();
    }
    return arr;
}

export default function reducer(state, action) {
    // Number of rows in the grid
    const n = 40;

    // Number of nodes in the transportation network
    const N = n * n;

    const initial = new Array(n);
    for (let i = 0; i < n; i++){
        initial[i] = new Array(N).fill(0);
    }

    initial[0][0] = 1;

    switch(action.type) {
        case RUN: {
            const newDist = iterate(state.dist);
            const newTime = state.time + 1;
            const newPeriods = state.periods + 50;
            return {
                ...state,
                dist: newDist,
                time: newTime,
                periods: newPeriods,
            };
        }
        case STOP: {
            return {
                ...state,
                dist: initial,
                time: 0,
                periods: 0,
            }
        }
        default:
            return state;
    }
}