'use strict';

function setup() {
    createCanvas(...getCanvasDimension()).parent('sketch');
    makeForm(
        makeSlider('numTiles', '[% t.numTiles %]', 4, 40, 20),
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
    noLoop();
}

function draw() {
    readControls();

    strokeWeight(1);
    stroke('black');
    noFill();
    rectMode(CENTER);
    angleMode(DEGREES);

    // scale down so the outer border is visible
    translate(width / 2, height / 2);
    scale(0.97);
    translate(-width / 2, -height / 2);

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

function windowResized() {
    resizeCanvas(...getCanvasDimension());
}

function keyPressed() {
    handleStandardKeys();
}
