'use strict';

function setupControls() {
    makeForm(
        makeFieldset('repetitions',
            makeSlider('numTiles', 4, 12, 9),
            makeSlider('scale', 0.6, 1, 0.8, 0.05),
        ),
        makeSlider('numPointsPerSide', 4, 8, 4),
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

            // move to the tile center so rotate() and scale() happen there
            ctx.translate((x - 0.5) * tileDim, (y - 0.5) * tileDim);

            ctx.scale(ctrl.scale, ctrl.scale);
            let points = [];
            for (let py = 0; py < ctrl.numPointsPerSide; py++) {
                for (let px = 0; px < ctrl.numPointsPerSide; px++) {
                    points.push([
                        Math.round(px * tileDim / (ctrl.numPointsPerSide - 1) - tileDim / 2),
                        Math.round(py * tileDim / (ctrl.numPointsPerSide - 1) - tileDim / 2)
                    ]);
                }
            }
            points = points.shuffle();
            for (let i = 0; i < points.length - 1; i++) {
                ctx.beginPath();
                ctx.moveTo(...points[i]);
                ctx.lineTo(...points[i + 1]);
                ctx.stroke();
            }

            ctx.restore();
        }
    }
}
