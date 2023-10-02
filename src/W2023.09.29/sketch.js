'use strict';

function setupForm() {
    makeForm(
        makeSlider('numTiles', 'Anzahl der Kacheln pro Achse', 3, 10, 4),
        makeSlider('maxOffset', 'Maximaler Versatz pro Achse', 0, 30, 15),
        makeSlider('repetitions', 'Anzahl der Wiederholungen', 2, 20, 10),
    );
}

function drawSketch() {
    noStroke();
    noFill();
    rectMode(CORNERS);
    background("white");
    stroke('black');
    padSketch(0.9);

    makeGrid({
        numTilesX: ctrl.numTiles,
        numTilesY: ctrl.numTiles,
        tileCallback: function(tile) {
            for (let i = 0; i < ctrl.repetitions; i++) {
                push();
                translate(
                    randomIntPlusMinus(ctrl.maxOffset),
                    randomIntPlusMinus(ctrl.maxOffset),
                );
                rect(...tile.upperLeft, ...tile.lowerRight);
                pop();
            }
        },
    });
}
