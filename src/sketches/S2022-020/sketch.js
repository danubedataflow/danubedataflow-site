'use strict';

makeForm(
    makeSlider('numTiles', 'Number of tiles', 4, 40, 20),
    makeSlider('chanceHorizontal', 'Chance for a horizontal line (%)', 0, 100, 30),
    makeSlider('chanceVertical', 'Chance for a vertical line (%)', 0, 100, 30),
    makeSlider('chanceDiagoalUp', 'Chance for an upwards diagonal line (%)', 0, 100, 30),
    makeSlider('chanceDiagoalDown', 'Chance for an downwards diagonal line (%)', 0, 100, 30),
    makeCheckbox('tileBorder', 'Tile border'),
);

function setup() {
    createCanvas(...getCanvasDimension()).parent('sketch');
}

function draw() {
    readControls();

    strokeWeight(1);
    stroke('black');
    noFill();
    rectMode(CORNER);
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
            translate((x - 1) * dim, (y - 1) * dim);

            if (ctrl.tileBorder) rect(0, 0, dim, dim);
            if (random(100) < ctrl.chanceHorizontal) line(0, dim / 2, dim, dim / 2);
            if (random(100) < ctrl.chanceVertical) line(dim / 2, 0, dim / 2, dim);
            if (random(100) < ctrl.chanceDiagoalUp) line(0, dim, dim, 0);
            if (random(100) < ctrl.chanceDiagoalDown) line(0, 0, dim, dim);

            pop();
        }
    }

    noLoop();
}

function windowResized() {
    resizeCanvas(...getCanvasDimension());
}

function keyPressed() {
    handleStandardKeys();
}
