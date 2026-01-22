import {
    run,
    makeForm,
    makeSlider
} from '/js/ui.js';
import {
    randomIntRange
} from '/js/math.js';
import {
    randomElement
} from '/js/array.js';
let c;

function setupControls() {
    makeForm(
        makeSlider('numTiles', 'Number of tiles per axis: {0}', 2, 20, 10),
        makeSlider('numRects', 'Number of rectangles: {0}', 2, 20, 10),
    );
}

function drawWork(config) {
    c = config;

    c.ctx.fillStyle = '#777777';
    c.ctx.fillRect(0, 0, c.width, c.height);
    let palette = ['white', '#aaaaaa', 'black'];
    let tileDim = c.width / c.ctrl.numTiles; // square canvas
    for (let i = 0; i <= c.ctrl.numRects; i++) {
        let ulX = randomIntRange(0, c.ctrl.numTiles - 1);
        let ulY = randomIntRange(0, c.ctrl.numTiles - 1);
        let spanX = randomIntRange(1, c.ctrl.numTiles - ulX);
        let spanY = randomIntRange(1, c.ctrl.numTiles - ulY);
        c.ctx.fillStyle = randomElement(palette);
        c.ctx.fillRect(ulX * tileDim, ulY * tileDim, spanX * tileDim, spanY * tileDim);
    }
}
let description = `Random white, grey and black rectangles, each spanning a random number of horizontal and vertical tiles.`;
run({
    createdDate: '2022-11-25',
    description,
    setupControls,
    drawWork
});
