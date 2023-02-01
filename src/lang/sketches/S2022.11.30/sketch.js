'use strict';

function setup() {
    createCanvas(...getCanvasDimension()).parent('sketch');
    makeForm(
        makeSlider('numTiles', '[% t.numTiles %]', 2, 20, 10),
        makeSlider('numRects', 'Number of rectangles', 2, 20, 10),
        makeSlider('scale', 'Scale', 0, 1, 0.9, 0.1),
        makeSlider('strokeWeight', '[% t.strokeWeight %]', 1, 20, [10, 12]),
        makeSlider('alpha', 'Alpha', 0, 255, [200, 255]),
    );
    noLoop();
}

function draw() {
    readControls();

    background('white');
    noFill();

    // Scale down to create a margin so the outermost strokes won't be clipped.
    let dim = width; // width == height because of square canvas
    translate(dim / 2, dim / 2);
    scale(ctrl.scale);
    translate(-dim / 2, -dim / 2);

    let tileDim = width / ctrl.numTiles;

    for (let i = 0; i <= ctrl.numRects; i++) {
        let ulX = randomIntRange(0, ctrl.numTiles - 1);
        let ulY = randomIntRange(0, ctrl.numTiles - 1);
        let spanX = randomIntRange(1, ctrl.numTiles - ulX);
        let spanY = randomIntRange(1, ctrl.numTiles - ulY);

        strokeWeight(randomIntRange(...ctrl.strokeWeight));
        stroke(0, randomIntRange(...ctrl.alpha));
        rect(ulX * tileDim, ulY * tileDim, spanX * tileDim, spanY * tileDim);
    }
}

function windowResized() {
    resizeCanvas(...getCanvasDimension());
}

function keyPressed() {
    handleStandardKeys();
}
