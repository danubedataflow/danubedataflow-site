'use strict';

function setupControls() {
    makeForm(
        makeSlider('numTiles', 'Number of tiles per axis: {0}', 1, 10, 5),
        makeSlider('numLines', 'Number of lines: {0}', 1, 10, 5),
        makeSlider('lineWidth', 'Stroke weight: {0}', 1, 3, 2),
        makeCheckbox('hasBend', 'Bend: '),
    );
}

function drawWork() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = 'black';

    let tileDim = width / ctrl.numTiles;
    for (let y = 1; y <= ctrl.numTiles; y++) {
        for (let x = 1; x <= ctrl.numTiles; x++) {
            ctx.save();

            // move to tile center to scale, then back to UL corner
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
}
