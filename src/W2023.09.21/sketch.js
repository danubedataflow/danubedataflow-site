'use strict';

function setupForm() {
    makeForm(
        makeFieldset('repetitions',
            makeSlider('numTiles', 4, 12, 9),
            makeSlider('scale', 0.6, 1, 0.8, 0.05),
        ),
        makeSlider('numPointsPerSide', 4, 8, 4),
    );
}

function drawSketch() {
    background('white');
    stroke('black');
    makeGrid({
        numTilesX: ctrl.numTiles,
        numTilesY: ctrl.numTiles,
        tileCallback: drawTile,
    });
}

function drawTile(tile) {
    scale(ctrl.scale);
    let points = [];
    for (let y = 0; y < ctrl.numPointsPerSide; y++) {
        for (let x = 0; x < ctrl.numPointsPerSide; x++) {
            points.push([
                int(x * tile.width / (ctrl.numPointsPerSide - 1) - tile.width / 2),
                int(y * tile.height / (ctrl.numPointsPerSide - 1) - tile.height / 2)
            ]);
        }
    }
    shuffle(points, true);
    for (let i = 0; i < points.length - 1; i++) {
        line(...points[i], ...points[i + 1]);
    }
}
