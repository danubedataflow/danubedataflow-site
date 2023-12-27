'use strict';

function setupForm() {
    makeForm(
        makeSlider('numTiles', 'XXX', 3, 10, 5),
        makeSlider('colorAngle', 'Winkel auf dem Farbenkreis', 0, 359, 0),
        makeSlider('scale', 'Skalierung der inneren Quadrate', 0.3, 0.7, 0.5, 0.05),
    );
}

function drawSketch() {
    noStroke();
    background("white");
    colorMode(HSB, 360, 100, 100)
    makeGrid({
        numTilesX: ctrl.numTiles,
        numTilesY: ctrl.numTiles,
        tileCallback: drawTile,
    });
}

function drawTile(tile) {
    fill(ctrl.colorAngle, 100, randomIntRange(40, 100));
    rect(...tile.upperLeft, ...tile.lowerRight);
    scale(ctrl.scale);
    fill(ctrl.colorAngle, 100, randomIntRange(40, 100));
    rect(...tile.upperLeft, ...tile.lowerRight);
}
