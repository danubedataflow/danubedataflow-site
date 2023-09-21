'use strict';

function setupForm() {
    makeForm(
        makeFieldset('Wiederholungen',
            makeSlider('repsPerSide', 'Anzahl der Wiederholungen pro Achse', 4, 12, 9),
            makeSlider('repScale', 'Skalierung jeder Wiederholung', 0.6, 1, 0.8, 0.05),
        ),
        makeSlider('squareSize', 'Anzahl der Punkte pro Seite im Quadrat', 4, 8, 4),
    );
}

function drawSketch() {
    background('white');
    stroke('black');
    makeGrid({
        numTilesX: ctrl.repsPerSide,
        numTilesY: ctrl.repsPerSide,
        gridWidth: width,
        gridHeight: height,
        tileCallback: function(tile) {
            scale(ctrl.repScale);
            let points = [];
            for (let y = 0; y < ctrl.squareSize; y++) {
                for (let x = 0; x < ctrl.squareSize; x++) {
                    points.push([
                        int(x * tile.width / (ctrl.squareSize - 1) - tile.width / 2),
                        int(y * tile.height / (ctrl.squareSize - 1) - tile.height / 2)
                    ]);
                }
            }
            shuffle(points, true);
            for (let i = 0; i < points.length - 1; i++) {
                line(...points[i], ...points[i + 1]);
            }
        },
    });
}
