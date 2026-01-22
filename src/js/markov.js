import {
    randomElement
} from '/js/array.js';
/*
 * This class implements a Markov chain.
 *
 * You can give it a set of states and a row-stochastic transition matrix, then
 * a starting state and have it compute the next state.
 *
 * You can use the API like this example. Assume that you want to model color
 * changes between red ('R'), green ('G') and blue ('B'). From each state,
 * there is a 70% chance to go to the next state, a 15% chance to go to the
 * previous state and a 15% chance to stay in the same state. The next state of
 * 'R' is 'G'; the next state of 'G' is 'B'; the next state of 'B' is 'R'.
 *
 *     let m = new MarkovChain();
 *     m.setStates(['R', 'G', 'B']);
 *     m.setTransitionMatrix([
 *         [0.15, 0.7, 0.15],    // R=>R, R=>G, R=>B
 *         [0.15, 0.15, 0.7],    // G=>R, G=>G, G=>B
 *         [0.7, 0.15, 0.15],    // B=>R, B=>G, B=>B
 *     ]);
 *     let ok = m.isValid();
 *     m.setCurrentState('R');
 *     let s = m.getNextState();
 *
 * setStates() defines the possible states.
 *
 * setCurrentState() sets the current state. It must check that the given state
 * is one of the states set by setStates().
 *
 * getNextState() takes the current state set by setCurrentState(), applies the
 * transition matrix and returns the resulting state. It also sets the
 * resulting state as the current state so I can just keep calling
 * getNextState().
 *
 * isValid() checks that the number of rows and columns are the same as the
 * number of states. Also it checks that it is a row-stochastic matrix, i.e.,
 * the sum of the value of each row of the transition matrix is 1. It returns a
 * boolean value.
 *
 * generateRandomTransitionMatrix() that generates a random row-stochastic
 * matrix with the same size as the number of states set by setStates().
 *
 * The getTransitionMatrix() method returns the current transition matrix.
 */
import {
    random
} from '/js/math.js';
class MarkovChain {
    constructor() {
        this.states = [];
        this.transitionMatrix = [];
        this.currentState = null;
    }
    setStates(states) {
        this.states = states.slice();
        this.currentState = null;
    }
    setTransitionMatrix(matrix) {
        this.transitionMatrix = matrix.map(row => row.slice());
    }
    getTransitionMatrix() {
        return this.transitionMatrix.map(row => row.slice());
    }
    setCurrentState(state) {
        if (!this.states.includes(state)) {
            throw new Error("Invalid state: " + state);
        }
        this.currentState = state;
    }
    isValid(epsilon = 1e-9) {
        const n = this.states.length;
        if (n === 0) return false;
        if (this.transitionMatrix.length !== n) return false;
        for (let i = 0; i < n; i++) {
            const row = this.transitionMatrix[i];
            if (!Array.isArray(row) || row.length !== n) return false;
            let sum = 0;
            for (let j = 0; j < n; j++) {
                const v = row[j];
                if (typeof v !== "number" || v < 0) return false;
                sum += v;
            }
            if (Math.abs(sum - 1) > epsilon) return false;
        }
        return true;
    }
    generateRandomTransitionMatrix() {
        const n = this.states.length;
        if (n === 0) {
            throw new Error("States must be set first.");
        }
        this.transitionMatrix = [];
        for (let i = 0; i < n; i++) {
            let row = [];
            let sum = 0;
            for (let j = 0; j < n; j++) {
                const r = random();
                row.push(r);
                sum += r;
            }
            // normalize row
            for (let j = 0; j < n; j++) {
                row[j] /= sum;
            }
            this.transitionMatrix.push(row);
        }
    }
    getNextState() {
        if (this.currentState === null) {
            throw new Error("Current state not set.");
        }
        if (!this.isValid()) {
            throw new Error("Invalid transition matrix.");
        }
        const i = this.states.indexOf(this.currentState);
        const row = this.transitionMatrix[i];
        const r = random();
        let acc = 0;
        for (let j = 0; j < row.length; j++) {
            acc += row[j];
            if (r <= acc) {
                this.currentState = this.states[j];
                return this.currentState;
            }
        }
        // numerical fallback
        this.currentState = this.states[this.states.length - 1];
        return this.currentState;
    }
}

function makeRandomMarkovChain(states) {
    const m = new MarkovChain();
    m.setStates(states);
    m.generateRandomTransitionMatrix();
    m.setCurrentState(randomElement(states));
    return m;
}
export {
    MarkovChain,
    makeRandomMarkovChain
};