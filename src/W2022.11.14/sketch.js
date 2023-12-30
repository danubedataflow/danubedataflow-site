'use strict';

function setupForm() {
    makeForm(
        makeSlider('numTiles', 4, 40, 20),
        makeFieldset('rotation',
            makeSlider('rotationChance', 0, 100, 5),
            makeSlider('rotationRange', -45, 45, [-10, 10]),
        ),
        makeFieldset('scale',
            makeSlider('scaleChance', 0, 100, 5),
            makeSlider('scaleRange', 50, 150, [80, 120]),
        ),
        makeFieldset('translation',
            makeSlider('translationChance', 0, 100, 5),
            makeSlider('translationRange', -50, 50, [-20, 20]),
        ),
        makeFieldset('stroke',
            makeSlider('strokeWeightChance', 0, 100, 5),
            makeSlider('strokeWeightRange', 1, 4, [2, 3]),
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

            if (random(100) < ctrl.rotationChance) rotate(random(...ctrl.rotationRange));
            if (random(100) < ctrl.scaleChance) scale(random(...ctrl.scaleRange) / 100);
            if (random(100) < ctrl.translationChance) translate(
                dim * random(...ctrl.translationRange) / 100,
                dim * random(...ctrl.translationRange) / 100);
            if (random(100) < ctrl.strokeWeightChance) strokeWeight(random(...ctrl.strokeWeightRange));
            rect(0, 0, dim, dim);

            pop();
        }
    }
}
