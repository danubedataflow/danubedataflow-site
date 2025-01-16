'use strict';

function setupControls() {
    makeForm(
        makeSlider('numTiles', 3, 10, 5),
        makeSlider('colorAngle', 0, 359, 0),
        makeSlider('scaleInner', 0.3, 0.7, 0.5, 0.05),
    );
}

function drawSketch() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    makeGrid({
        numTilesX: ctrl.numTiles,
        numTilesY: ctrl.numTiles,
        tileCallback: drawTile,
    });
}

function drawTile(tile) {
    ctx.fillStyle = colorHSL(ctrl.colorAngle, 100, 40 + randomIntUpTo(60));
    ctx.fillRect(...tile.upperLeft, tile.width, tile.height);
    ctx.scale(ctrl.scaleInner, ctrl.scaleInner);
    ctx.fillStyle = colorHSL(ctrl.colorAngle, 100, 40 + randomIntUpTo(60));
    ctx.fillRect(...tile.upperLeft, tile.width, tile.height);
}

