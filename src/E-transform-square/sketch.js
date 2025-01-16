'use strict';

function setupControls() {
    makeForm(
        makeSlider('numTiles', 3, 5, 4),
        makeSlider('scaleRange', 0.5, 0.9, [0.6, 0.8], 0.05),
        makeSlider('rotationRange', 0, 90, [0, 90]),
    );
}

function drawSketch() {
    noStroke();
    background('white');
    fill('black');

    makeGrid({
        numTilesX: ctrl.numTiles,
        numTilesY: ctrl.numTiles,
        tileCallback: drawTile,
    });
}

function drawTile(tile) {
    scale(random(...ctrl.scaleRange));
    rotate(random(...ctrl.rotationRange));
    rectMode(CENTER);
    rect(0, 0, tile.width, tile.height);
}
