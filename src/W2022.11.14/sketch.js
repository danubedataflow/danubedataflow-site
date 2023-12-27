'use strict';

function setupForm() {
    makeForm(
        makeSlider('numTiles', 'XXX', 4, 40, 20),
        makeFieldset('Rotation',
            makeSlider('rotationChance', 'Wahrscheinlichkeit (%)', 0, 100, 5),
            makeSlider('rotationAmount', 'Winkel', -45, 45, [-10, 10]),
        ),
        makeFieldset('Skalierung',
            makeSlider('scaleChance', 'Wahrscheinlichkeit (%)', 0, 100, 5),
            makeSlider('scaleAmount', 'Wert (%)', 50, 150, [80, 120]),
        ),
        makeFieldset('Translation',
            makeSlider('translationChance', 'Wahrscheinlichkeit (%)', 0, 100, 5),
            makeSlider('translationAmount', 'Wert (%)', -50, 50, [-20, 20]),
        ),
        makeFieldset('Strich',
            makeSlider('strokeChance', 'Wahrscheinlichkeit (%)', 0, 100, 5),
            makeSlider('strokeAmount', 'Stärke', 1, 4, [2, 3]),
        ),
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
            // `+ 0.5` to move to the tile's center
            translate((x - 1) * (dim + 0.5), (y - 1) * (dim + 0.5));

            if (random(100) < ctrl.rotationChance) rotate(random(...ctrl.rotationAmount));
            if (random(100) < ctrl.scaleChance) scale(random(...ctrl.scaleAmount) / 100);
            if (random(100) < ctrl.translationChance) translate(
                dim * random(...ctrl.translationAmount) / 100,
                dim * random(...ctrl.translationAmount) / 100);
            if (random(100) < ctrl.strokeChance) strokeWeight(random(...ctrl.strokeAmount));
            rect(0, 0, dim, dim);

            pop();
        }
    }
}
