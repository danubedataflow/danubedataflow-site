'use strict';

function setupForm() {
    makeForm(
        makeSlider('numTiles', 3, 10, 4),
        makeSlider('maxOffsetPerAxis', 0, 30, 15),
        makeSlider('numSquaresPerTile', 2, 20, 10),
    );
}

function drawSketch() {
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = 'black';
    padSketch(0.9);

    makeGrid({
        numTilesX: ctrl.numTiles,
        numTilesY: ctrl.numTiles,
        tileCallback: drawTile,
    });
    ctx.restore();
}

function drawTile(tile) {
    for (let i = 0; i < ctrl.numSquaresPerTile; i++) {
        ctx.save();
        ctx.translate(
            randomIntPlusMinus(ctrl.maxOffsetPerAxis),
            randomIntPlusMinus(ctrl.maxOffsetPerAxis),
        );
        ctx.strokeRect(...tile.upperLeft, tile.width, tile.height);
        ctx.restore();
    }
}
