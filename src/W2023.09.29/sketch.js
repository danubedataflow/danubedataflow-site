'use strict';

function setupForm() {
    makeForm(
        makeSlider('numTiles', 3, 10, 4),
        makeSlider('maxOffsetPerAxis', 0, 30, 15),
        makeSlider('numSquaresPerTile', 2, 20, 10),
    );
}

function drawSketch() {
    noStroke();
    noFill();
    background("white");
    stroke('black');
    padSketch(0.9);

    makeGrid({
        numTilesX: ctrl.numTiles,
        numTilesY: ctrl.numTiles,
        tileCallback: drawTile,
    });
}

function drawTile(tile) {
    for (let i = 0; i < ctrl.numSquaresPerTile; i++) {
        push();
        translate(
            randomIntPlusMinus(ctrl.maxOffsetPerAxis),
            randomIntPlusMinus(ctrl.maxOffsetPerAxis),
        );
        rect(...tile.upperLeft, ...tile.lowerRight);
        pop();
    }
}
