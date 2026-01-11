'use strict';

function setupControls() {
    makeForm(
        makeSlider('numTiles', 'Number of tiles per axis: {0}', 3, 10, 4),
        makeSlider('maxOffsetPerAxis', 'Maximum offset per axis: {0}', 0, 30, 15),
        makeSlider('numSquaresPerTile', 'Number of squares per tile: {0}', 2, 20, 10),
    );
}

function drawSketch() {
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = 'black';

    // pad the work
    ctx.translate(width / 2, height / 2);
    ctx.scale(0.9, 0.9);
    ctx.translate(-width / 2, -height / 2);

    let tileDim = width / ctrl.numTiles;
    for (let y = 1; y <= ctrl.numTiles; y++) {
        for (let x = 1; x <= ctrl.numTiles; x++) {
            let tileULX = (x - 1) * tileDim;
            let tileULY = (y - 1) * tileDim;

            for (let i = 0; i < ctrl.numSquaresPerTile; i++) {
                let xOffset = randomIntPlusMinus(ctrl.maxOffsetPerAxis);
                let yOffset = randomIntPlusMinus(ctrl.maxOffsetPerAxis);
                ctx.strokeRect(tileULX + xOffset, tileULY + yOffset, tileDim, tileDim);
            }
        }
    }
    ctx.restore();
}
