'use strict';

function setupForm() {
    makeForm(
        makeSlider('numTiles', 'XXX', 4, 40, 20),
        makeSlider('horizontalLineChance', 'Wahrscheinlichkeit einer horizontalen Linie (%)', 0, 100, 30),
        makeSlider('verticalLineChance', 'Wahrscheinlichkeit einer vertikalen Linie (%)', 0, 100, 30),
        makeSlider('diagonalUpwardsLineChance', 'Wahrscheinlichkeit einer diagonalen Aufwärtslinie (%)', 0, 100, 30),
        makeSlider('diagonalDownwardsLineChance', 'Wahrscheinlichkeit einer diagonalen Abwärtslinie (%)', 0, 100, 30),
        makeCheckbox('hasTileBorder'),
    );
}

function drawSketch() {
    strokeWeight(1);
    stroke('black');
    noFill();
    padSketch();
    background('white');
    let dim = width / ctrl.numTiles;
    for (let y = 1; y <= ctrl.numTiles; y++) {
        for (let x = 1; x <= ctrl.numTiles; x++) {
            push();
            translate((x - 1) * dim, (y - 1) * dim);

            if (ctrl.hasTileBorder) rect(0, 0, dim, dim);
            if (random(100) < ctrl.horizontalLineChance) line(0, dim / 2, dim, dim / 2);
            if (random(100) < ctrl.verticalLineChance) line(dim / 2, 0, dim / 2, dim);
            if (random(100) < ctrl.diagonalUpwardsLineChance) line(0, dim, dim, 0);
            if (random(100) < ctrl.diagonalDownwardsLineChance) line(0, 0, dim, dim);

            pop();
        }
    }
}
