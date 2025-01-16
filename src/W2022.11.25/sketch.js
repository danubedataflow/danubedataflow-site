'use strict';

function setupControls() {
    makeForm(
        makeSlider('numTiles', 2, 20, 10),
        makeSlider('numRects', 2, 20, 10),
    );
}

function drawSketch() {
    ctx.fillStyle = '#777777';
    ctx.fillRect(0, 0, width, height);

    let palette = ['white', '#aaaaaa', 'black'];
    let tileDim = width / ctrl.numTiles; // square canvas

    for (let i = 0; i <= ctrl.numRects; i++) {
        let ulX = randomIntRange(0, ctrl.numTiles - 1);
        let ulY = randomIntRange(0, ctrl.numTiles - 1);
        let spanX = randomIntRange(1, ctrl.numTiles - ulX);
        let spanY = randomIntRange(1, ctrl.numTiles - ulY);

        ctx.fillStyle = palette.randomElement();
        ctx.fillRect(ulX * tileDim, ulY * tileDim, spanX * tileDim, spanY * tileDim);
    }
}
