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

    let tileWidth = width / ctrl.numTiles;
    let tileHeight = height / ctrl.numTiles;
    for (let y = 1; y <= ctrl.numTiles; y++) {
        for (let x = 1; x <= ctrl.numTiles; x++) {
            ctx.save();

            // move to the tile center so rotate() and scale() happen there
            ctx.translate((x - 0.5) * tileWidth, (y - 0.5) * tileHeight);

            ctx.scale(ctrl.scale, ctrl.scale);
            let points = [];
            for (let y = 0; y < ctrl.numPointsPerSide; y++) {
                for (let x = 0; x < ctrl.numPointsPerSide; x++) {
                    points.push([
                        Math.round(x * tileWidth / (ctrl.numPointsPerSide - 1) - tileWidth / 2),
                        Math.round(y * tileHeight / (ctrl.numPointsPerSide - 1) - tileHeight / 2)
                    ]);
                }
            }
            points = points.shuffle();
            for (let i = 0; i < points.length - 1; i++) {
                line(points[i], points[i + 1]);
                ctx.stroke();
            }

            ctx.restore();
        }
    }
}
