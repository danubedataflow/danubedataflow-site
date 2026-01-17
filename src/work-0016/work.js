'use strict';
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

function setupControls() {
    makeForm(
        makeSlider('numTiles', 'Number of tiles per axis: {0}', 2, 20, 10),
        makeSlider('numRects', 'Number of rectangles: {0}', 2, 20, 10),
    );
}

function drawWork(args) {
    const {
        ctx,
        width,
        height,
        ctrl
    } = args;
    ctx.fillStyle = '#777777';
    ctx.fillRect(0, 0, width, height);
    let palette = ['white', '#aaaaaa', 'black'];
    let tileDim = width / ctrl.numTiles; // square canvas
    for (let i = 0; i <= ctrl.numRects; i++) {
        let ulX = randomIntRange(0, ctrl.numTiles - 1);
        let ulY = randomIntRange(0, ctrl.numTiles - 1);
        let spanX = randomIntRange(1, ctrl.numTiles - ulX);
        let spanY = randomIntRange(1, ctrl.numTiles - ulY);
        ctx.fillStyle = randomElement(palette);
        ctx.fillRect(ulX * tileDim, ulY * tileDim, spanX * tileDim, spanY * tileDim);
    }
}
let description = `No description yet.`;
run({
    createdDate: '2022-11-25',
    description,
    setupControls,
    drawWork
});