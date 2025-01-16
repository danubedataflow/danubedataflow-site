'use strict';

function setupControls() {
    makeForm(
        makeSlider('numTiles', 1, 10, 5),
        makeSlider('numLines', 1, 10, 5),
        makeSlider('lineWidth', 1, 3, 2),
        makeCheckbox('hasBend'),
    );
}

function drawSketch() {
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = 'black';

    makeGrid({
        numTilesX: ctrl.numTiles,
        numTilesY: ctrl.numTiles,
        tileCallback: drawTile,
    });
    ctx.restore();
}

function drawTile(tile) {
    ctx.scale(0.9, 0.9);
    ctx.save();
    ctx.translate(...tile.upperLeft);

    ctx.lineWidth = ctrl.lineWidth;
    for (let i = 0; i < ctrl.numLines; i++) {
        ctx.beginPath();
        ctx.moveTo(randomIntUpTo(tile.width), 0);
        if (ctrl.hasBend) ctx.lineTo(randomIntUpTo(tile.width), randomIntUpTo(tile.height));
        ctx.lineTo(randomIntUpTo(tile.width), tile.height);
        ctx.stroke();
    }

    // draw a border
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, tile.width, tile.height);
    ctx.restore();
}
