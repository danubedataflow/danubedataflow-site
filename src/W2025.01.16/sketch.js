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

    let tileDim = width / ctrl.numTiles;
    for (let y = 1; y <= ctrl.numTiles; y++) {
        for (let x = 1; x <= ctrl.numTiles; x++) {
            ctx.save();

            // move to the tile center so rotate() and scale() happen there
            ctx.translate((x - 0.5) * tileDim, (y - 0.5) * tileDim);

            ctx.scale(0.9, 0.9);
            ctx.translate(-tileDim / 2, -tileDim / 2);

            ctx.lineWidth = ctrl.lineWidth;
            for (let i = 0; i < ctrl.numLines; i++) {
                ctx.beginPath();
                ctx.moveTo(randomIntUpTo(tileDim), 0);
                if (ctrl.hasBend) ctx.lineTo(randomIntUpTo(tileDim), randomIntUpTo(tileDim));
                ctx.lineTo(randomIntUpTo(tileDim), tileDim);
                ctx.stroke();
            }

            // draw a border
            ctx.lineWidth = 1;
            ctx.strokeRect(0, 0, tileDim, tileDim);

            ctx.restore();
        }
    }
    ctx.restore();
}
