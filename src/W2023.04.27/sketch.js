'use strict';

let palette;

function setupControls() {
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
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    palette = chroma.scale(ctrl.colorMap).colors(ctrl.numColors);

    makeGrid({
        numTilesX: ctrl.numTilesX,
        numTilesY: ctrl.numTilesY,
        tileCallback: drawTile,
    });
}

function drawTile(tile) {

    ctx.fillStyle = randomIntUpTo(100) < ctrl.coloredTileChance ? palette.randomElement() : 'white';
    ctx.fillRect(...tile.upperLeft, tile.width, tile.height);

    ctx.fillStyle = randomIntUpTo(100) < ctrl.coloredDiamondChance ? palette.randomElement() : 'white';
    triangle(tile.upperMiddle, tile.center, tile.leftMiddle);
    ctx.fill();

    ctx.fillStyle = randomIntUpTo(100) < ctrl.coloredDiamondChance ? palette.randomElement() : 'white';
    triangle(tile.upperMiddle, tile.center, tile.rightMiddle);
    ctx.fill();

    ctx.fillStyle = randomIntUpTo(100) < ctrl.coloredDiamondChance ? palette.randomElement() : 'white';
    triangle(tile.lowerMiddle, tile.center, tile.leftMiddle);
    ctx.fill();

    ctx.fillStyle = randomIntUpTo(100) < ctrl.coloredDiamondChance ? palette.randomElement() : 'white';
    triangle(tile.lowerMiddle, tile.center, tile.rightMiddle);
    ctx.fill();
}
