'use strict';

function setup() {
    createCanvas(...getCanvasDimension()).parent('sketch');
    makeForm(
        makeSlider('numTiles', 'Number of tiles', 2, 20, 10),
        makeSlider('numRects', 'Number of rectangles', 2, 20, 10),
    );
    noLoop();
}

function draw() {
    readControls();

    background('#777777');
    let palette = ['white', '#aaaaaa', 'black'];
    noStroke();

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

function windowResized() {
    resizeCanvas(...getCanvasDimension());
}

function keyPressed() {
    handleStandardKeys();
}
