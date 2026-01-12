'use strict';

function setupControls() {
    makeForm(
        makeSlider('numTilesX', 'Number of horizontal tiles: {0}', 10, 70, 50),
        makeSlider('numTilesY', 'Number of vertical tiles: {0}', 10, 70, 50),
        makeSlider('scale', 'Scale: {0}', 1, 2, 1.5, 0.1),
        makeSlider('angleStep', 'Angle step: {0}', 2, 32, 16),
        makeSlider('maxOffsetPerAxis', 'Maximum offset per axis: {0}', 0, 10, 2),
        makeSlider('lineWidth', 'Stroke weight: {0}', 1, 6, 1),
    );
}

function drawWork() {
    ctx.save();

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    ctx.lineWidth = ctrl.lineWidth;
    ctx.strokeStyle = 'black';

    // pad the work
    ctx.translate(width / 2, height / 2);
    ctx.scale(0.97, 0.97);
    ctx.translate(-width / 2, -height / 2);

    let tileWidth = width / ctrl.numTilesX;
    let tileHeight = height / ctrl.numTilesY;
    for (let y = 1; y <= ctrl.numTilesY; y++) {
        for (let x = 1; x <= ctrl.numTilesX; x++) {
            ctx.save();

            // move to the tile center so rotate() and scale() happen there
            ctx.translate((x - 0.5) * tileWidth, (y - 0.5) * tileHeight);

            ctx.rotate(2 * Math.PI * randomIntUpTo(ctrl.angleStep) / ctrl.angleStep);
            ctx.translate(
                randomIntPlusMinus(ctrl.maxOffsetPerAxis),
                randomIntPlusMinus(ctrl.maxOffsetPerAxis),
            );

            // `ctx.scale(ctrl.scale, ctrl.scale)` instead would also change the line weight.
            ctx.beginPath();
            ctx.moveTo(ctrl.scale * -tileWidth / 2, 0);
            ctx.lineTo(ctrl.scale * tileWidth / 2, 0);
            ctx.stroke();

            ctx.restore();
        }
    }

    ctx.restore();
}
