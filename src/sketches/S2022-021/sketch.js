'use strict';

makeForm(
    makeSlider('numTiles', 'Number of tiles', 4, 40, 20),
    makeFieldset('Rotation',
        makeSlider('rotationChance', 'Chance (%)', 0, 100, 5),
        makeSlider('rotationAmount', 'Angles', -45, 45, [-10, 10]),
    ),
    makeFieldset('Scale',
        makeSlider('scaleChance', 'Chance (%)', 0, 100, 5),
        makeSlider('scaleAmount', 'Amount (%)', 50, 150, [80, 120]),
    ),
    makeFieldset('Translation',
        makeSlider('translationChance', 'Chance (%)', 0, 100, 5),
        makeSlider('translationAmount', 'Amount (%)', -50, 50, [-20, 20]),
    ),
    makeFieldset('Stroke',
        makeSlider('strokeChance', 'Chance (%)', 0, 100, 5),
        makeSlider('strokeAmount', 'Weight', 1, 4, [2, 3]),
    ),
);

function initSketch() {
    background('white');
    strokeWeight(1);
    stroke('black');
    noFill();
    rectMode(CENTER);
    angleMode(DEGREES);
}

function draw() {
    readControls();
    simpleGrid({
        numTiles: ctrl.numTiles,
        margin: width / 10,
        callback: (config) => {
            let {
                dim
            } = config;
            if (random(100) < ctrl.rotationChance) rotate(int(random(...ctrl.rotationAmount)));
            if (random(100) < ctrl.scaleChance) scale(random(...ctrl.scaleAmount) / 100);
            if (random(100) < ctrl.translationChance) translate(
                dim * random(...ctrl.translationAmount) / 100,
                dim * random(...ctrl.translationAmount) / 100);
            if (random(100) < ctrl.strokeChance) strokeWeight(random(...ctrl.strokeAmount));
            rect(0, 0, dim, dim);
        }
    });
    noLoop();
}
