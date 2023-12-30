'use strict';

let palette;

function setupForm() {
    makeForm(
        makeFieldset('colors',
            makeSelectColorMap(),
            makeSlider('numColors', 2, 32, 16),
        ),
        makeSlider('coloredTileChance', 0, 100, 50),
        makeSlider('coloredDiamondChance', 0, 100, 50),
        makeSlider('numTilesX', 4, 40, 10),
        makeSlider('numTilesY', 4, 40, 10),
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

    fill(random(100) < ctrl.coloredTileChance ? random(palette) : "white");
    rect(...tile.upperLeft, ...tile.lowerRight);

    fill(random(100) < ctrl.coloredDiamondChance ? random(palette) : "white");
    triangle(...tile.upperMiddle, ...tile.center, ...tile.leftMiddle);

    fill(random(100) < ctrl.coloredDiamondChance ? random(palette) : "white");
    triangle(...tile.upperMiddle, ...tile.center, ...tile.rightMiddle);

    fill(random(100) < ctrl.coloredDiamondChance ? random(palette) : "white");
    triangle(...tile.lowerMiddle, ...tile.center, ...tile.leftMiddle);

    fill(random(100) < ctrl.coloredDiamondChance ? random(palette) : "white");
    triangle(...tile.lowerMiddle, ...tile.center, ...tile.rightMiddle);
}
