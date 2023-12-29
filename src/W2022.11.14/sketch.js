'use strict';

function setupForm() {
    makeForm(
        makeSlider('numTiles', 'XXX', 4, 40, 20),
        makeFieldset('rotation',
            makeSlider('rotationChance', 'XXX', 0, 100, 5),
            makeSlider('rotationRange', 'XXX', -45, 45, [-10, 10]),
        ),
        makeFieldset('scale',
            makeSlider('scaleChance', 'XXX', 0, 100, 5),
            makeSlider('scaleRange', 'XXX', 50, 150, [80, 120]),
        ),
        makeFieldset('translation',
            makeSlider('translationChance', 'XXX', 0, 100, 5),
            makeSlider('translationRange', 'XXX', -50, 50, [-20, 20]),
        ),
        makeFieldset('stroke',
            makeSlider('strokeChance', 'XXX', 0, 100, 5),
            makeSlider('strokeRange', 'XXX', 1, 4, [2, 3]),
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
            if (random(100) < ctrl.strokeChance) strokeWeight(random(...ctrl.strokeRange));
            rect(0, 0, dim, dim);

            pop();
        }
    }
}
