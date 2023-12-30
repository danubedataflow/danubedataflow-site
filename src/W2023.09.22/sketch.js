'use strict';

function setupForm() {
    makeForm(
        makeSlider('numTilesX', 10, 100, 50),
        makeSlider('numTilesY', 10, 100, 50),
        makeSlider('scale', 0.5, 1.5, 1, 0.1),
        makeSlider('maxOffsetPerAxis', 0, 10, 2),
        makeSlider('strokeWeight', 1, 6, 1),
    );
}

function drawSketch() {
    noStroke();
    background("white");
    strokeWeight(ctrl.strokeWeight);
    stroke('black');
    padSketch();
    makeGrid({
        numTilesX: ctrl.numTilesX,
        numTilesY: ctrl.numTilesY,
        tileCallback: drawTile,
    });
}

function drawTile(tile) {
    if (random() > 0.2) {
        scale(ctrl.scale);
        rotate(30 * int(random(12)));
        translate(
            randomIntPlusMinus(ctrl.maxOffsetPerAxis),
            randomIntPlusMinus(ctrl.maxOffsetPerAxis),
        );
        line(...tile.leftMiddle, ...tile.rightMiddle);
    }
}
