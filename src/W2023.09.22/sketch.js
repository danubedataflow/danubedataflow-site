'use strict';

function setupForm() {
    makeForm(
        makeSlider('numTilesX', 10, 70, 50),
        makeSlider('numTilesY', 10, 70, 50),
        makeSlider('scale', 1, 2, 1.5, 0.1),
        makeSlider('angleStep', 2, 32, 16),
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
    if (1) {
        rotate((360 / ctrl.angleStep) * int(random(ctrl.angleStep)));
        translate(
            randomIntPlusMinus(ctrl.maxOffsetPerAxis),
            randomIntPlusMinus(ctrl.maxOffsetPerAxis),
        );

        // `scale(ctrl.scale)` instead would also change the line weight.
        line(...tile.leftMiddle.map(n => n * ctrl.scale), ...tile.rightMiddle.map(n => n * ctrl.scale));
    }
}
