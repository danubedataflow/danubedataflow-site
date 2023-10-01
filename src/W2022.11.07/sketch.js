'use strict';

function setupForm() {
    makeForm(
        makeSlider('numTiles', 'Anzahl der Kacheln pro Achse', 4, 40, 20),
        makeSlider('chanceHorizontal', 'Wahrscheinlichkeit einer horizontalen Linie (%)', 0, 100, 30),
        makeSlider('chanceVertical', 'Wahrscheinlichkeit einer vertikalen Linie (%)', 0, 100, 30),
        makeSlider('chanceDiagoalUp', 'Wahrscheinlichkeit einer diagonalen Aufwärtslinie (%)', 0, 100, 30),
        makeSlider('chanceDiagoalDown', 'Wahrscheinlichkeit einer diagonalen Abwärtslinie (%)', 0, 100, 30),
        makeCheckbox('tileBorder', 'Kachelrand'),
    );
}

function drawSketch() {
    strokeWeight(1);
    stroke('black');
    noFill();
    rectMode(CORNER);
    angleMode(DEGREES);
    padSketch();
    background('white');
    let dim = width / ctrl.numTiles;
    for (let y = 1; y <= ctrl.numTiles; y++) {
        for (let x = 1; x <= ctrl.numTiles; x++) {
            push();
            translate((x - 1) * dim, (y - 1) * dim);

            if (ctrl.tileBorder) rect(0, 0, dim, dim);
            if (random(100) < ctrl.chanceHorizontal) line(0, dim / 2, dim, dim / 2);
            if (random(100) < ctrl.chanceVertical) line(dim / 2, 0, dim / 2, dim);
            if (random(100) < ctrl.chanceDiagoalUp) line(0, dim, dim, 0);
            if (random(100) < ctrl.chanceDiagoalDown) line(0, 0, dim, dim);

            pop();
        }
    }
}
