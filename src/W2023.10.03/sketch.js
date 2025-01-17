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

    let tileDim = width / ctrl.numTiles;
    for (let y = 1; y <= ctrl.numTiles; y++) {
        for (let x = 1; x <= ctrl.numTiles; x++) {
            ctx.save();

            // move to the tile center so rotate() and scale() happen there
            ctx.translate((x - 0.5) * tileDim, (y - 0.5) * tileDim);

            ctx.fillStyle = colorHSL(ctrl.colorAngle, 100, 40 + randomIntUpTo(60));
            ctx.fillRect(-tileDim / 2, -tileDim / 2, tileDim, tileDim);
            ctx.scale(ctrl.scaleInner, ctrl.scaleInner);
            ctx.fillStyle = colorHSL(ctrl.colorAngle, 100, 40 + randomIntUpTo(60));
            ctx.fillRect(-tileDim / 2, -tileDim / 2, tileDim, tileDim);

            ctx.restore();
        }
    }
}
