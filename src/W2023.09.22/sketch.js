'use strict';

function setupForm() {
    makeForm(
        makeSlider('numTilesX', 'Anzahl der horizontalen Kacheln', 10, 100, 50),
        makeSlider('numTilesY', 'Anzahl der vertikalen Kacheln', 10, 100, 50),
        makeSlider('scale', 'Skalierung', 0.5, 1.5, 1, 0.1),
        makeSlider('maxOffset', 'Maximaler Versatz pro Achse', 0, 10, 2),
    );
}

function drawSketch() {
    noStroke();
    background("white");
    stroke('black');
    angleMode(DEGREES);
    padSketch();
    makeGrid({
        numTilesX: ctrl.numTilesX,
        numTilesY: ctrl.numTilesY,
        tileCallback: function(tile) {
            if (random() > 0.2) {
                scale(ctrl.scale);
                rotate(30 * int(random(12)));
                translate(
                    randomIntPlusMinus(ctrl.maxOffset),
                    randomIntPlusMinus(ctrl.maxOffset),
                );
                line(...tile.leftMiddle, ...tile.rightMiddle);
            }
        },
    });
}