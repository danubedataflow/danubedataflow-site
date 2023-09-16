'use strict';

function setupForm() {
    makeForm(
        makeSlider('numTiles', 'Anzahl der Kacheln', 2, 20, 10),
        makeSlider('numRects', 'Anzahl der Rechtecke', 2, 20, 10),
    );
}

function drawSketch() {
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
