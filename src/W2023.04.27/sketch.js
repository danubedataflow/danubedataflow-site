'use strict';

let palette;

function setupForm() {
    makeForm(
        makeFieldset('colors',
            makeSelectColorMap(),
            makeSlider('numColors', 'XXX', 2, 32, 16),
        ),
        makeSlider('chanceTileColor', 'Wahrscheinlichkeit einer gefärbten Kachel (%)', 0, 100, 50),
        makeSlider('chanceDiamondColor', 'Wahrscheinlichkeit einer gefärbten Raute (%)', 0, 100, 50),
        makeSlider('numTilesX', 'Anzahl der horizontalen Kacheln', 4, 40, 10),
        makeSlider('numTilesY', 'Anzahl der vertikalen Kacheln', 4, 40, 10),
    );
}

function drawSketch() {
    noStroke();
    background("white");
    palette = chroma.scale(ctrl.colorMap).colors(ctrl.numColors);

    makeGrid({
        numTilesX: ctrl.numTilesX,
        numTilesY: ctrl.numTilesY,
        tileCallback: drawTile,
    });
}

function drawTile(tile) {

    fill(random(100) < ctrl.chanceTileColor ? random(palette) : "white");
    rect(...tile.upperLeft, ...tile.lowerRight);

    fill(random(100) < ctrl.chanceDiamondColor ? random(palette) : "white");
    triangle(...tile.upperMiddle, ...tile.center, ...tile.leftMiddle);

    fill(random(100) < ctrl.chanceDiamondColor ? random(palette) : "white");
    triangle(...tile.upperMiddle, ...tile.center, ...tile.rightMiddle);

    fill(random(100) < ctrl.chanceDiamondColor ? random(palette) : "white");
    triangle(...tile.lowerMiddle, ...tile.center, ...tile.leftMiddle);

    fill(random(100) < ctrl.chanceDiamondColor ? random(palette) : "white");
    triangle(...tile.lowerMiddle, ...tile.center, ...tile.rightMiddle);
}
