'use strict';

const config = new Config()
    .maxIterations(1);

makeForm(
    makeSlider('numTiles', 'Number of tiles', 2, 20, 10),
    makeSlider('numRects', 'Number of rectangles', 2, 20, 10),
);

let palette;

function initSketch() {
    background('#777777');
    palette = ['white', '#aaaaaa', 'black'];
    noStroke();
}

function drawSketch() {
    let tileDim = width / ctrl.numTiles; // square canvas

    for (let i = 0; i <= ctrl.numRects; i++) {
        let ulX = randomIntRange(0, ctrl.numTiles - 1);
        let ulY = randomIntRange(0, ctrl.numTiles - 1);
        let spanX = randomIntRange(1, ctrl.numTiles - ulX);
        let spanY = randomIntRange(1, ctrl.numTiles - ulY);

        fill(random(palette));
        rect(ulX * tileDim, ulY * tileDim, spanX * tileDim, spanY * tileDim);
    }
}
