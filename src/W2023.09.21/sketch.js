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
    makeGrid({
        numTilesX: ctrl.numTiles,
        numTilesY: ctrl.numTiles,
        tileCallback: drawTile,
    });
}

function drawTile(tile) {
    ctx.scale(ctrl.scale, ctrl.scale);
    let points = [];
    for (let y = 0; y < ctrl.numPointsPerSide; y++) {
        for (let x = 0; x < ctrl.numPointsPerSide; x++) {
            points.push([
                Math.round(x * tile.width / (ctrl.numPointsPerSide - 1) - tile.width / 2),
                Math.round(y * tile.height / (ctrl.numPointsPerSide - 1) - tile.height / 2)
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
}
