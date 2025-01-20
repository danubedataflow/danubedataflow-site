'use strict';

function setupControls() {
    makeForm(
        makeSlider('numTiles', 1, 10, 5),
    );
}

function drawSketch() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = 'black';

    let tileDim = width / ctrl.numTiles;
    for (let y = 1; y <= ctrl.numTiles; y++) {
        for (let x = 1; x <= ctrl.numTiles; x++) {
            ctx.save();

            // move to tile center to rotate
            ctx.translate((x - 0.5) * tileDim, (y - 0.5) * tileDim);

            // ...

            ctx.restore();
        }
    }
}
