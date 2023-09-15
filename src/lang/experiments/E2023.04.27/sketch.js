'use strict';

function setupForm() {
    makeForm(
        makeSelectColorMap(),
        makeSlider('numColors', '[% t.numColors %]', 2, 32, 16),
        makeSlider('chanceTileColor', 'Chance of a tile color (%)', 0, 100, 50),
        makeSlider('chanceDiamondColor', 'Chance of a diamond color (%)', 0, 100, 50),
        makeSlider('numTilesX', '[% t.numTilesX %]', 4, 40, 10),
        makeSlider('numTilesY', '[% t.numTilesY %]', 4, 40, 10),
    );
}

function draw() {
    readControls();

    noStroke();
    rectMode(CENTER);
    background("white");
    let palette = chroma.scale(ctrl.colorMap).colors(ctrl.numColors);

    makeGrid(ctrl.numTilesX, ctrl.numTilesY, function(tile) {

        fill(random(100) < ctrl.chanceTileColor ? random(palette) : "white");
        rect(...tile.center, tile.width, tile.height);

        fill(random(100) < ctrl.chanceDiamondColor ? random(palette) : "white");
        triangle(...tile.upperMiddle, ...tile.center, ...tile.leftMiddle);


        fill(random(100) < ctrl.chanceDiamondColor ? random(palette) : "white");
        triangle(...tile.upperMiddle, ...tile.center, ...tile.rightMiddle);

        fill(random(100) < ctrl.chanceDiamondColor ? random(palette) : "white");
        triangle(...tile.lowerMiddle, ...tile.center, ...tile.leftMiddle);

        fill(random(100) < ctrl.chanceDiamondColor ? random(palette) : "white");
        triangle(...tile.lowerMiddle, ...tile.center, ...tile.rightMiddle);
    });
}
