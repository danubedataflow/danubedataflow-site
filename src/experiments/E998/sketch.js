'use strict';

const config = new Config()
    .title('E998')
    .maxIterations(1);

makeForm(
    makeSlider('numTiles', 'Number of tiles', 2, 20, 10),
    makeSlider('numRects', 'Number of rectangles', 2, 20, 10),
);

let palette;

function initSketch() {
    background("#777777");
    palette = ['white', '#aaaaaa', 'black'];
    noStroke();
}

function drawSketch() {
    let tileDim = width / ctrl.numTiles; // square canvas

    for (let i = 0; i <= ctrl.numRects; i++) {
        let ulX = int(random(ctrl.numTiles));
        let ulY = int(random(ctrl.numTiles));
        let wX = int(random(ctrl.numTiles - ulX) + 1);
        let wY = int(random(ctrl.numTiles - ulY) + 1);
        fill(random(palette));
        rect(ulX * tileDim, ulY * tileDim, wX * tileDim, wY * tileDim);
    }
}
