import {
    run,
    makeForm,
    makeSlider
} from '/js/ui.js';
import {
    randomElement
} from '/js/array.js';
import {
    Point
} from '/js/point.js';
import {
    MarkovChain
} from '/js/markov.js';
let c;

function setupControls() {
    makeForm(
        makeSlider('numTiles', 'Number of tiles per axis: {0}', 10, 60, 35),
    );
}

function drawWork(config) {
    c = config;
    const step = c.width / c.ctrl.numTiles;

    const m = new MarkovChain();
    const states = ['A', 'B', 'C', 'D'];
    m.setStates(states);
    m.generateRandomTransitionMatrix();
    m.setCurrentState(randomElement(states));

    c.ctx.fillStyle = 'white';
    c.ctx.fillRect(0, 0, c.width, c.height);

    c.ctx.strokeStyle = 'black';
    c.ctx.lineWidth = 1;

    // scan order: left-to-right, top-to-bottom
    for (let y = 0; y < c.ctrl.numTiles; y++) {
        for (let x = 0; x < c.ctrl.numTiles; x++) {
            const state = m.getNextState();

            // tile's upper left corner
            const p = new Point(x * step, y * step);

            c.ctx.beginPath();
            if (state == 'A') {
                // diagonal from the cell's upper left to lower right
                c.ctx.moveTo(...p.asArray());
                c.ctx.lineTo(...p.move(step, step).asArray());
            } else if (state == 'B') {
                // diagonal from the cell's upper right to lower left
                c.ctx.moveTo(...p.moveX(step).asArray());
                c.ctx.lineTo(...p.moveY(step).asArray());
            } else if (state == 'C') {
                // vertical line in the middle of the cell
                c.ctx.moveTo(...p.moveX(step / 2).asArray());
                c.ctx.lineTo(...p.move(step / 2, step).asArray());
            } else if (state == 'D') {
                // horizontal line in the middle of the cell
                c.ctx.moveTo(...p.moveY(step / 2).asArray());
                c.ctx.lineTo(...p.move(step, step / 2).asArray());
            }
            c.ctx.closePath();
            c.ctx.stroke();
        }
    }
}

let description = `A finite Markov chain is evaluated once over a two-dimensional grid, assigning a line orientation to each cell according to its immediately preceding state. So the probabilistic rule that is normally applied over time is applied instead across space. See my notes on <a href="/notes/markov-chains.html">Markov chains</a>.`;
run({
    createdDate: '2026-01-21',
    description,
    setupControls,
    drawWork
});
