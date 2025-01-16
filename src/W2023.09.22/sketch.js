'use strict';

function setupControls() {
    makeForm(
        makeSlider('numTilesX', 10, 70, 50),
        makeSlider('numTilesY', 10, 70, 50),
        makeSlider('scale', 1, 2, 1.5, 0.1),
        makeSlider('angleStep', 2, 32, 16),
        makeSlider('maxOffsetPerAxis', 0, 10, 2),
        makeSlider('strokeWeight', 1, 6, 1),
    );
}

function drawSketch() {
    ctx.save();

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    ctx.lineWidth = ctrl.strokeWeight;
    ctx.strokeStyle = 'black';

    padSketch();
    makeGrid({
        numTilesX: ctrl.numTilesX,
        numTilesY: ctrl.numTilesY,
        tileCallback: drawTile,
    });

    ctx.restore();
}

function drawTile(tile) {
    ctx.rotate(2 * Math.PI * randomIntUpTo(ctrl.angleStep) / ctrl.angleStep);
    ctx.translate(
        randomIntPlusMinus(ctrl.maxOffsetPerAxis),
        randomIntPlusMinus(ctrl.maxOffsetPerAxis),
    );

    // `ctx.scale(ctrl.scale, ctrl.scale)` instead would also change the line weight.
    ctx.beginPath();
    ctx.moveTo(...tile.leftMiddle.map(n => n * ctrl.scale));
    ctx.lineTo(...tile.rightMiddle.map(n => n * ctrl.scale));
    ctx.stroke();
}
